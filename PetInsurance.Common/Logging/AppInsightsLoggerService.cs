using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Newtonsoft.Json;
using SX.API.Common.Shared.Interfaces;

namespace PetInsurance.Common.Logging
{
    public class AppInsightsLoggerService<T> : ILoggerService<T> where T : class
    {
        private readonly TelemetryClient _client;

        public AppInsightsLoggerService()
        {
            _client = new TelemetryClient();
        }

        public void Debug(string message, object data = null, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Information, message, null, data, memberName, lineNumber, filePath);
        }

        public void DebugStart([CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Information, "Start", null, null, memberName, lineNumber, filePath);
        }

        public void DebugEnd([CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Information, "End", null, null, memberName, lineNumber, filePath);
        }

        public void Error(string message, object data = null, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Error, message, null, data, memberName, lineNumber, filePath);
        }

        public void Error(Exception exception, string message = "", object data = null, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Error, message, exception, data, memberName, lineNumber, filePath);
        }

        public void Info(string message, object data = null, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Information, message, null, data, memberName, lineNumber, filePath);
        }

        public void Warn(string message, object data = null, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Warning, message, null, data, memberName, lineNumber, filePath);
        }

        private void BaseLog(SeverityLevel severity, string message = "", Exception exception = null, object data = null, string memberName = "", int lineNumber = 0, string path = "")
        {
            var serializerSettings = new JsonSerializerSettings
            {
                Error = (sender, args) =>
                {
                    args.ErrorContext.Handled = true;
                }
            };
            
            var properties = new Dictionary<string, string>
            {
                {"ApplicationMethod", $"{typeof(T).Name}.{memberName}:{lineNumber}"},
                {"FilePath", path},
                {"Data", JsonConvert.SerializeObject(data, serializerSettings)},
                {"Source", "PetQnB" }
            };
            
            if (exception != null)
            {
                properties.Add("Message", message);
                _client.TrackException(exception, properties);
            }
            else
            {
                _client.TrackTrace(message, severity, properties);
            }
        }

        public void DebugEnd(Stopwatch stopwatch, [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
        }
    }
}
