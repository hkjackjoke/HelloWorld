using Newtonsoft.Json;
using PetInsurance.Common;
using PetInsurance.Common.Logging;
using PetInsurance.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace PetInsurance.DataAccessLayer
{
    public class ApiService
    {
        private readonly AppInsightsLoggerService<ApiService> _logger = new AppInsightsLoggerService<ApiService>();
        private readonly CertificateProviderService _certProvider = new CertificateProviderService();

        public async Task<List<Organisation>> GetOrgByPhoneAsync(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                return null;
            }
            phoneNumber = new string(phoneNumber.Where(char.IsDigit).ToArray());
            using (var handler = new WebRequestHandler())
            using (X509Certificate2 cert = _certProvider.GetCertificate())
            {
#if DEBUG
                if (cert == null)
                {
                    // debug for localhost that does not have certificate, return dummy data
                    return new List<Organisation>() { new Organisation()
                    {
                        address = "dummy address",
                        organisationName = "dummy organisation name",
                        phoneNumber = "1234567",
                        organisationId = 1
                    }};
                }
#endif
                handler.ClientCertificates.Add(cert);
                using (HttpClient httpClient = CreateHttpClientWithHeader(handler))
                {
                    string url = Common.ConfigurationHelper.GetValue("PetQnB_GetOrgUrl");
                    HttpResponseMessage response =
                        await httpClient.GetAsync($"{url}?phonenumber={phoneNumber}");
                    if (response.IsSuccessStatusCode)
                    {
                        string content = await response.Content.ReadAsStringAsync();
                        if (string.IsNullOrEmpty(content))
                        {
                            return new List<Organisation>();
                        }
                        try
                        {
                            List<Organisation> org = JsonConvert.DeserializeObject<List<Organisation>>(content);
                            return org;
                        }
                        catch (Exception)
                        {
                            // ignored
                        }
                    }
                }
            }
            return null;
        }

        public async Task<List<Organisation>> GetOrgByTypeAsync(string orgType)
        {
            if (string.IsNullOrWhiteSpace(orgType))
            {
                return null;
            }
            using (var handler = new WebRequestHandler())
            using (X509Certificate2 cert = _certProvider.GetCertificate())
            {
#if DEBUG
                if (cert == null)
                {
                    // debug for localhost that does not have certificate, return dummy data
                    string breeder = "[{\"leadSourcedes\":\"Breeder\",\"leadSourceTypeId\":2,\"active\":true,\"logoImage\":110471,\"postCode\":\"\",\"city\":\"\",\"address\":\"\",\"website\":\"\",\"emailAddress\":\"\",\"phoneNumber\":\"098880000\",\"contactPerson\":\"Eddy\",\"organisationdes\":\"\",\"organisationName\":\"Ed\'s Elephants\",\"organisationId\":1}]";
                    return JsonConvert.DeserializeObject<List<Organisation>>(breeder);
                }
#endif
                handler.ClientCertificates.Add(cert);
                using (HttpClient httpClient = CreateHttpClientWithHeader(handler))
                {
                    string url = Common.ConfigurationHelper.GetValue("PetQnB_GetOrgUrl");
                    HttpResponseMessage response =
                        await httpClient.GetAsync($"{url}?orgtype={orgType}");
                    if (response.IsSuccessStatusCode)
                    {
                        string content = await response.Content.ReadAsStringAsync();
                        if (string.IsNullOrEmpty(content))
                        {
                            return new List<Organisation>();
                        }
                        try
                        {
                            List<Organisation> org = JsonConvert.DeserializeObject<List<Organisation>>(content);
                            return org;
                        }
                        catch (Exception)
                        {
                            // ignored
                        }
                    }
                }
            }
            return null;
        }

        public async Task<List<Organisation>> GetSpcaAsync()
        {

            using (var handler = new WebRequestHandler())
            using (X509Certificate2 cert = _certProvider.GetCertificate())
            {
#if DEBUG
                if (cert == null)
                {
                    return new List<Organisation>() { new Organisation() { organisationId = 1, organisationName = $"Cannot find certificate" } };
                    // debug for localhost that does not have certificate, return dummy data
                    //string content = @"[{""organisationId"":558,""organisationName"":""Fake Otago SPCA""},{""organisationId"":557,""organisationName"":""Nelson SPCA""},{""organisationId"":556,""organisationName"":""Marlborough SPCA""},{""organisationId"":555,""organisationName"":""Manawatu SPCA""},{""organisationId"":554,""organisationName"":""Kapiti SPCA""},{""organisationId"":553,""organisationName"":""Horowhenua SPCA""},{""organisationId"":552,""organisationName"":""Hawkes Bay SPCA""},{""organisationId"":551,""organisationName"":""Hastings and Districts SPCA""},{""organisationId"":550,""organisationName"":""Gisborne SPCA""},{""organisationId"":549,""organisationName"":""Central Hawkes Bay SPCA""},{""organisationId"":548,""organisationName"":""Canterbury SPCA""},{""organisationId"":547,""organisationName"":""Auckland SPCA""}]";
                    //List<Organisation> org = JsonConvert.DeserializeObject<List<Organisation>>(content);
                    //return org;
                }
#endif
                handler.ClientCertificates.Add(cert);
                using (HttpClient httpClient = CreateHttpClientWithHeader(handler))
                {
                    string url = Common.ConfigurationHelper.GetValue("PetQnB_SpcaBranchesUrl");
                    try
                    {
                        HttpResponseMessage response =
                            await httpClient.GetAsync(url);
                        if (response.IsSuccessStatusCode)
                        {
                            string content = await response.Content.ReadAsStringAsync();
                            try
                            {
                                List<Organisation> org = JsonConvert.DeserializeObject<List<Organisation>>(content);
                                return org;
                            }
                            catch (Exception)
                            {
                                // ignored
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        return new List<Organisation>() { new Organisation() { organisationId = 1, organisationName = JsonConvert.SerializeObject(e) } };

                    }
                }
            }
            return null;
        }

        public async Task<object> TestConnectionAsync()
        {
            using (var handler = new WebRequestHandler())
            using (X509Certificate2 cert = _certProvider.GetCertificate())
            {
                if (cert == null)
                {
                    return "Cannot find certificate, please install and adjust web.config to the correct certificate Location and StoreName";
                }
                handler.ClientCertificates.Add(cert);
                using (HttpClient httpClient = CreateHttpClientWithHeader(handler))
                {
                    string url = Common.ConfigurationHelper.GetValue("PetQnB_SpcaBranchesUrl");
                    try
                    {
                        HttpResponseMessage response =
                            await httpClient.GetAsync(url);
                        string content = await response.Content.ReadAsStringAsync();
                        if (response.IsSuccessStatusCode)
                        {
                            try
                            {
                                List<Organisation> org = JsonConvert.DeserializeObject<List<Organisation>>(content);
                                return "Connection is working.";
                            }
                            catch (Exception)
                            {
                                // ignored
                                return $"Success request, but cannot parse response: {content}";
                            }
                        }
                        return $"Not success request, response: {content}"; ;
                    }
                    catch (Exception e)
                    {
                        return $"Has exception: {JsonConvert.SerializeObject(e)}";
                    }
                }
            }
        }

        public async Task<List<Breed>> GetBreedsAsync(string speciesId)
        {
            using (var handler = new WebRequestHandler())
            using (X509Certificate2 cert = _certProvider.GetCertificate())
            {
#if DEBUG
                if (cert == null)
                {
                    // debug for localhost that does not have certificate, return dummy data
                    return new List<Breed>() { new Breed()
                    {
                        active = true,
                        breeddes = "dummpy breed des",
                        breedId = 123,
                        breedImageId = 123,
                        breedName = "dummpy breed name",
                        riskRating = 1,
                        speciesId = 1
                    }, new Breed()
                        {
                            active = true,
                            breeddes = "dummpy breed des 2",
                            breedId = 1234,
                            breedImageId = 1234,
                            breedName = "dummpy breed name 2",
                            riskRating = 2,
                            speciesId = 2
                        }};
                }
#endif
                handler.ClientCertificates.Add(cert);
                using (HttpClient httpClient = CreateHttpClientWithHeader(handler))
                {
                    string url = Common.ConfigurationHelper.GetValue("PetQnB_GetbreedsUrl");
                    HttpResponseMessage response =
                        await httpClient.GetAsync($"{url}{speciesId}");
                    if (response.IsSuccessStatusCode)
                    {
                        string content = await response.Content.ReadAsStringAsync();
                        try
                        {
                            List<Breed> breeds = JsonConvert.DeserializeObject<List<Breed>>(content);
                            return breeds;
                        }
                        catch (Exception)
                        {
                            // ignored
                        }
                    }
                }
            }
            return null;
        }

        public async Task CreateFreeCoverAsync(FreeCoverPayload createFreeCoverPayload)
        {
            using (var handler = new WebRequestHandler())
            using (X509Certificate2 cert = _certProvider.GetCertificate())
            {
#if DEBUG
                if (cert == null)
                {
                    // debug for localhost that does not have certificate, return dummy data
                    return;
                }
#endif
                handler.ClientCertificates.Add(cert);
                var content = new StringContent(JsonConvert.SerializeObject(createFreeCoverPayload), Encoding.UTF8, "application/json");
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                using (HttpClient httpClient = CreateHttpClientWithHeader(handler))
                {
                    string url = Common.ConfigurationHelper.GetValue("PetQnB_FreeCoverReqUrl");
                    HttpResponseMessage response =
                        await httpClient.PostAsync(url, content);
                    Task<string> result = response.Content.ReadAsStringAsync();
                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception(result.Result);
                    }
                }
            }
        }

        private HttpClient CreateHttpClientWithHeader(WebRequestHandler handler)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var httpClient = new HttpClient(handler);
            string apikey = Common.ConfigurationHelper.GetValue("PetQnB_ApiKey");
            httpClient.DefaultRequestHeaders.Add("apikey", apikey);
            return httpClient;
        }
    }
}
