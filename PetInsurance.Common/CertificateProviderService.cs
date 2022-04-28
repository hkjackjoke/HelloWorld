using System.Net;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;

namespace PetInsurance.Common
{
    public class CertificateProviderService
    {
        public X509Certificate2 GetCertificate()
        {
            string thumbprint = Common.ConfigurationHelper.GetValue("PetQnB_CertificateThumbprint");

            X509Certificate2 cert = GetCertificate(StoreLocation.CurrentUser, thumbprint);

            if (cert == null)
            {
                return GetCertificate(StoreLocation.LocalMachine, thumbprint);
            }

            return cert;
        }

        private X509Certificate2 GetCertificate(StoreLocation location, string thumbprint)
        {
            using (var certStore = new X509Store(StoreName.My, location))
            {
                certStore.Open(OpenFlags.ReadOnly);
                X509Certificate2Collection certCollection = certStore.Certificates.Find(X509FindType.FindByThumbprint, thumbprint, false);

                return certCollection.Count == 1 ? certCollection[0] : null;
            }
        }
    }
}
