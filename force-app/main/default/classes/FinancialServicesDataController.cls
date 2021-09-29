public with sharing class FinancialServicesDataController {
 
    @AuraEnabled(cacheable = true)
    public static List<Account> fetchAccounts() {
	
		List<Account> lstFinancialData = [SELECT Id, Name, Industry, AnnualRevenue, Phone, Website, Owner.Name FROM Account WHERE Industry = 'Financial Services' LIMIT 10 ];
     
        return lstFinancialData;
         
    }
     
}