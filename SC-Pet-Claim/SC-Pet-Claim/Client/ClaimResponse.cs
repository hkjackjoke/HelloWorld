namespace SC_Pet_Claim.Client
{
    public class ClaimResponse
    {
        public bool Success { get; set; }
        public string ReferenceNo { get; set; }
        public string SecurityHash { get; set; }
    }
}