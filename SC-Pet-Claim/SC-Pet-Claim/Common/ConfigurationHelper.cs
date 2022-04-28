using System;
using System.Configuration;

namespace SC_Pet_Claim.Common
{
    public static class ConfigurationHelper
    {
        public static string GetValue(string key)
        {
            return Environment.GetEnvironmentVariable(key) ?? ConfigurationManager.AppSettings[key];
        }
    }
}