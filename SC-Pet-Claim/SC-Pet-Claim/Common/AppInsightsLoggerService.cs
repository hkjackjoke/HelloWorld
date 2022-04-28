using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace SC_Pet_Claim.Common
{
    public class AppInsightsLoggerService<T>
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

        public void Error(string message, object data = null, string correlationId = "", [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Error, message, null, data, memberName, lineNumber, filePath, correlationId);
        }

        public void Error(Exception exception, string message = "", object data = null, string correlationId = "", [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Error, message, exception, data, memberName, lineNumber, filePath, correlationId);
        }

        public void Info(string message, object data = null, string correlationId = "", [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Information, message, null, data, memberName, lineNumber, filePath, correlationId);
        }

        public void Warn(string message, object data = null, string correlationId = "", [CallerMemberName] string memberName = "", [CallerLineNumber] int lineNumber = int.MinValue, [CallerFilePath] string filePath = "")
        {
            BaseLog(SeverityLevel.Warning, message, null, data, memberName, lineNumber, filePath, correlationId);
        }

        private void BaseLog(SeverityLevel severity, string message = "", Exception exception = null, object data = null, string memberName = "", int lineNumber = 0, string path = "", string correlationId = "")
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
                {"Source", "PetClaim" },
                {"ApplicationMethod", $"{typeof(T).Name}.{memberName}:{lineNumber}"},
                {"FilePath", path},
                {"Data", JsonConvert.SerializeObject(data, serializerSettings)},
                {"Correlation-Id", correlationId }
            };

            if (exception != null)
            {
                _client.TrackException(exception, properties);
            }
            else
            {
                _client.TrackTrace(message, severity, properties);
            }
        }
    }
}