using System.Linq;

namespace SC_Pet_Claim.Models
{
    public class ApiModel
    {
        public ApiModel(ApplicationModel applicationModel)
        {
            BankAccountHolderName = applicationModel.VetBankAccountName ?? "";

            BankAccountInfo accountInfo = new BankAccountInfo(applicationModel.BankAccount);

            BankCode = accountInfo.BankCode;
            BranchCode = accountInfo.BranchNumber;
            BankAccountNumber = accountInfo.AccountNumber;

            FirstName = applicationModel.FirstName;
            LastName = applicationModel.LastName;
            PetName = applicationModel.PetName;
            PolicyNo = applicationModel.PolicyNumber ?? "";
            EMail = applicationModel.Email ?? "";
            PhoneNo = applicationModel.ContactNumber ?? "";

            if (!int.TryParse(applicationModel.VetBankAccount, out int payToServiceProvider))
            {
                payToServiceProvider = 0;
            }


            PayToServiceProvider = payToServiceProvider;

            ClaimValue = applicationModel.Invoices.Sum(x =>
            {
                if (!decimal.TryParse(x.Amount, out decimal amount))
                {
                    amount = 0;
                }

                return amount;
            });
        }

        public string BankAccountHolderName { get; }

        public string BankAccountNumber { get; }

        public string BankCode { get; }

        public string BranchCode { get; }

        public decimal? ClaimValue { get; }

        public string EMail { get; }

        public string FirstName { get; }

        public string LastName { get; }

        public int PayToServiceProvider { get; }

        public string PetName { get; }

        public string PhoneNo { get; }

        public string PolicyNo { get; }
    }

    public class BankAccountInfo
    {
        public BankAccountInfo(string bankAccount)
        {
            if (string.IsNullOrWhiteSpace(bankAccount))
            {
                return;
            }

            string[] bankParts = bankAccount.Split('-');

            BankCode = bankParts.ElementAtOrDefault(0);
            BranchNumber = bankParts.ElementAtOrDefault(1);
            AccountNumber = string.Join("-", bankParts.Skip(2).Take(2));
        }

        public string BankCode { get; }
        public string BranchNumber { get; }
        public string AccountNumber { get; }
    }
}