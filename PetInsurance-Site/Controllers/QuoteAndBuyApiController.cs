using PetInsurance.Common;
using PetInsurance.Common.Logging;
using PetInsurance.DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace PetInsurance_Site.Controllers
{
    [Route("api")]
    [Route("quote/api")]
    public class QuoteAndBuyApiController : ApiController
    {
        private readonly ApigeeApiClient _apigeeClient;
        private readonly GoogleCaptchaClient _captchaClient;
        private readonly AppInsightsLoggerService<QuoteAndBuyApiController> _logger = new AppInsightsLoggerService<QuoteAndBuyApiController>();
        private static DateTime? _cacheClearTime = null;
        private static readonly object _lockObj = new object();
        private static readonly Dictionary<string, object> _resultObjectDictionary = new Dictionary<string, object>();

        public QuoteAndBuyApiController()
        {
            _apigeeClient = new ApigeeApiClient();
            _captchaClient = new GoogleCaptchaClient();
        }

        private static void CheckAndClearCacheIfTimeOut(bool forceRefresh = false)
        {
            if (forceRefresh || _cacheClearTime == null || DateTime.Now > _cacheClearTime)
            {
                lock (_lockObj)
                {
                    _resultObjectDictionary.Clear();
                }
                int cacheInteval = Convert.ToInt32(ConfigurationHelper.GetValue("PetQnB_CacheInteval"));
                _cacheClearTime = DateTime.Now.AddHours(cacheInteval);
            }
        }

        private async Task<List<string>> RefreshToken(bool forceRefresh = false)
        {
            // this api will be fired every min, which will do 2 things
            // 1st is to refresh our pet jwt token (jwt token has 10 mins expiry-time, so the following HTTP post can use the valid token always
            // 2nd is to make sure once the cache expired, we will use this method to cache the HTTP GET results, so the real uses won't experience the delay
            // forceRefresh is a place for us to hit manually, in case backend UPM+ has changed data, we don't want to wait for 24 hours cache period
            var result = new List<string>();
            CheckAndClearCacheIfTimeOut(forceRefresh);
            string allowedPath = ConfigurationHelper.GetValue("PetQnB_AllowedPath");
            var prefixList = allowedPath.Split(';').ToList();
            try
            {
                // make sure we always fire one api call to renew jwt token
                IEnumerable<KeyValuePair<string, string>> queryParams = Request.GetQueryNameValuePairs();
                await _apigeeClient.Execute<object>(HttpMethod.Get, prefixList[0], queryParameters: queryParams);
            }
            catch (Exception e)
            {
                result.Add(e.Message);
            }
            foreach (string path in prefixList)
            {
                if (IsPathNeedsToCache(path))
                {
                    lock (_lockObj)
                    {
                        if (_resultObjectDictionary != null && _resultObjectDictionary.ContainsKey(path))
                        {
                            continue;
                        }
                    }
                }
                try
                {
                    IEnumerable<KeyValuePair<string, string>> queryParams = Request.GetQueryNameValuePairs();
                    await _apigeeClient.Execute<object>(HttpMethod.Get, path, queryParameters: queryParams);

                }
                catch (Exception e)
                {
                    result.Add(e.Message);
                }
            }

            return result;
        }

        [Route("{path}")]
        [HttpGet]
        public async Task<IHttpActionResult> Get([FromUri] string path)
        {
            if (path != null && path.ToLower().StartsWith("refresh-token"))
            {
                List<string> result = await RefreshToken(path.ToLower().Contains("force"));
                return Ok(result);
            }
            if (!string.IsNullOrWhiteSpace(path) && !IsPathAllowed(path.ToLower()))
            {
                _logger.Error($"HTTP GET {path} not allowed ", null);

                return StatusCode(HttpStatusCode.Forbidden);
            }

            CheckAndClearCacheIfTimeOut();
            if (IsPathNeedsToCache(path))
            {
                lock (_lockObj)
                {
                    if (_resultObjectDictionary != null && _resultObjectDictionary.ContainsKey(path))
                    {
                        return Ok(_resultObjectDictionary[path]);
                    }
                }
            }
            try
            {
                IEnumerable<KeyValuePair<string, string>> queryParams = Request.GetQueryNameValuePairs();
                ApiResponse<object> result = await _apigeeClient.Execute<object>(HttpMethod.Get, path, queryParameters: queryParams);

                return ApiResult(result, path);
            }
            catch (Exception e)
            {
                _logger.Error($"HTTP GET path {path} exception", e);
                throw;
            }
        }

        [Route("{path}")]
        [HttpPost]
        public async Task<IHttpActionResult> Post([FromUri] string path, [FromBody] object body, string captchaToken = null)
        {
            return await Execute(HttpMethod.Post, path, body, captchaToken);
        }

        [Route("{path}")]
        [HttpPut]
        public async Task<IHttpActionResult> Put([FromUri] string path, [FromBody] object body, string captchaToken = null)
        {
            return await Execute(HttpMethod.Put, path, body, captchaToken);
        }

        private async Task<IHttpActionResult> Execute(HttpMethod method, string path, object body, string captchaToken = null)
        {
            if (!string.IsNullOrWhiteSpace(path) && !IsPathAllowed(path.ToLower()))
            {
                _logger.Error($"HTTP {method.Method} path {path} not allowed ", body);
                return StatusCode(HttpStatusCode.Forbidden);
            }
            // Validates Google captcha token
            ApiResponse<GoogleCaptchaResponse> captchaResult = await _captchaClient.Verify(path, captchaToken);

            if (!captchaResult.Success)
            {
                _logger.Error($"Captcha token for HTTP {method.Method} path {path} is invalid ", captchaResult);
                return ApiResult(captchaResult, path);
            }
            try
            {
                IEnumerable<KeyValuePair<string, string>> queryParams = Request.GetQueryNameValuePairs();
                ApiResponse<object> result = await _apigeeClient.Execute<object>(method, path, body, queryParams);

                return ApiResult(result, path);
            }
            catch (Exception e)
            {
                _logger.Error($"HTTP {method.Method} path {path} exception ", e);
                throw;
            }
        }

        private bool IsPathAllowed(string path)
        {
            string allowedPath = ConfigurationHelper.GetValue("PetQnB_AllowedPath");
            if (!string.IsNullOrWhiteSpace(allowedPath))
            {
                var prefixList = allowedPath.Split(';').ToList();
                return prefixList.Any(p => path.StartsWith(p));
            }
            return false;
        }

        private bool IsPathNeedsToCache(string path)
        {
            string cachePath = ConfigurationHelper.GetValue("PetQnB_CachePath");
            if (!string.IsNullOrWhiteSpace(cachePath) && !string.IsNullOrWhiteSpace(path))
            {
                var prefixList = cachePath.Split(';').ToList();
                return prefixList.Any(path.StartsWith);
            }

            return false;
        }

        private IHttpActionResult ApiResult<TResponseType>(ApiResponse<TResponseType> result, string path)
        {
            if (result.Success)
            {
                if (result.Item == null)
                {
                    return Ok(result.Message);
                }

                if (IsPathNeedsToCache(path))
                {
                    lock (_lockObj)
                    {
                        if (_resultObjectDictionary.ContainsKey(path))
                        {
                            _resultObjectDictionary[path] = result.Item;
                        }
                        else
                        {
                            _resultObjectDictionary.Add(path, result.Item);
                        }
                    }
                }

                return Ok(result.Item);
            }
            _logger.Error($"HTTP call for path {path} not success ", result);

            switch (result.StatusCode)
            {
                case HttpStatusCode.BadRequest:
                    return BadRequest(result.Message);
                case HttpStatusCode.NotFound:
                    return NotFound();
                case 0:
                    // Could not reach target server;
                    return StatusCode(HttpStatusCode.BadGateway);
                default:
                    throw new Exception(result.Message);
            }
        }
    }
}