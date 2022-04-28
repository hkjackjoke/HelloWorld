using System.Net;

namespace PetInsurance.DataAccessLayer
{
    /// <summary>
    /// API response
    /// </summary>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    public class ApiResponse<TResult>
    {
        /// <summary>
        /// Whether the response was successful
        /// </summary>
        public bool Success { get; set; }
        /// <summary>
        /// HTTP Status code returned
        /// </summary>
        public HttpStatusCode StatusCode { get; set; }
        /// <summary>
        /// Error Message (or non-successful raw content)
        /// </summary>
        public string Message { get; set; }
        /// <summary>
        /// Successfully parsed content
        /// </summary>
        public TResult Item { get; set; }
    }
}
