using System;
using System.Configuration;

namespace PetInsurance.Common
{
    public static class ConfigurationHelper
    {
        public static string GetValue(string key)
        {
            return Environment.GetEnvironmentVariable(key) ?? ConfigurationManager.AppSettings[key];
        }

        public static T GetValue<T>(string key, T defaultValue = default(T)) where T : IConvertible
        {
            string value = GetValue(key) ?? string.Empty;

            T result = defaultValue;

            if (!string.IsNullOrEmpty(value))
            {
                T defaultType = default(T);

                // Necessary as a string is a reference type, and the default value of a refernce type is... null
                if (typeof(T) == typeof(string))
                {
                    defaultType = (T)(object)string.Empty;
                }

                result = (T)Convert.ChangeType(value, defaultType.GetTypeCode());
            }

            return result;
        }
    }
}