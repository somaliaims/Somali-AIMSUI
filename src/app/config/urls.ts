export const urls = {
	//baseUrl: "http://104.140.103.166:7000/api/",
	//excelFilesUrl: "http://104.140.103.166:7000/ExcelFiles/",
	baseUrl: "http://localhost:60815/api/",
	excelFilesUrl: "http://localhost:60815/ExcelFiles/",
	getToken: "User/Token",
	checkEmailAvailability: "User/CheckEmailAvailability/",
	userRegistration: "User",
	editUserPassword: "User/EditPassword/",
	deleteUserAccount: "User/DeleteAccount",
	resetPasswordRequest: "User/ResetPasswordRequest/",
	resetPassword: "User/ResetPassword",
	organizationsList: "Organization/GetUserOrganizations",
	allOrganizationsList: "Organization",
	deleteLocation: "Location/Delete/",
	organizationTypesList: "OrganizationType",
	userNotificationsList: "Notification",
	userAccountActivation: "User/ActivateAccount/",
	searchOrganizations: "Organization/",
	getOrganization: "Organization/GetById/",
	organizationUrl: "Organization",
	mergeOrganization: "Organization/Merge",
	renameOrganization: "Organization/Rename/",
	deleteOrganization: "Organization/Delete/",
	locationUrl: "Location",
	getLocation: "Location/GetById/",
	sectorTypesUrl: "SectorTypes",
	defaultSectorTypeUrl: "SectorTypes/GetDefault",
	sectorsForTypesUrl: "Sector/GetSectorsForType/",
	sectorMappingsUrl: "SectorMappings/GetForSector/",
	sectorMappings: "SectorMappings/",
	mappingsForSector: "SectorMappings/GetSectorMappings/",
	mappingsForSectorByName: "SectorMappings/GetSectorMappingsByName",
	otherSectorTypesUrl: "SectorTypes/GetOtherSectorTypes",
	getSectorType: "SectorTypes/GetById/",
	sectorCategoriesUrl: "SectorCategory",
	getSectorCategory: "SectorCategory/GetById/",
	sectorSubCategoriesUrl: "SectorSubCategory",
	getSectorSubCategory: "SectorSubCategory/GetById/",
	sectorsUrl: "Sector",
	addSectorWithMapping: "Sector/AddSectorWithMapping",
	deleteSector: "Sector/Delete/",
	sectorChildren: "Sector/GetChildren/",
	financialYearsUrl: "FinancialYear",
	getSector: "Sector/GetById/",
	setSectorChild: "Sector/SetChild/",
	removeSectorChild: "Sector/RemoveChild/",
	projectTypesUrl: "ProjectType",
	getProjectType: "ProjectType/GetById/",
	projectsUrl: "Project",
	projectsDetailUrl: "Project/GetAllWithDetail",
	getProject: "Project/GetById/",
	organizationProjects: "Project/GetOrganizationProjects/",
	locationProjects: "Project/GetLocationProjects/",
	mergeProjects: "Project/MergeProjects",
	getProjectProfileReport: "Project/GetProjectProfileReport/",
	getProjectTitle: "Project/GetTitle/",
	getProjectLocationsUrl: "Project/GetLocations/",
	addProjectLocation: "Project/AddProjectLocation",
	getProjectSectorsUrl: "Project/GetSectors/",
	addProjectSector: "Project/AddProjectSector",
	getProjectFundersUrl: "Project/GetFunders/",
	addProjectFunder: "Project/AddProjectFunder",
	addProjectField: "Project/AddProjectCustomField",
	getProjectImplementersUrl: "Project/GetImplementers/",
	addProjectImplementer: "Project/AddProjectImplementer",
	getProjectDisbursementUrl: "Project/GetDisbursements/",
	addProjectDisbursement: "Project/AddProjectDisbursement",
	getProjectDocumentUrl: "Project/GetDocuments/",
	addProjectDocument: "Project/AddProjectDocument",
	deleteProjectLocation: "Project/DeleteProjectLocation/",
	deleteProjectSector: "Project/DeleteProjectSector/",
	deleteProjectFunder: "Project/DeleteProjectFunder/",
	deleteProjectImplementer: "Project/DeleteProjectImplementer/",
	deleteProjectDisbursement: "Project/DeleteProjectDisbursement/",
	deleteProjectDocument: "Project/DeleteProjectDocument/",
	deleteProjectField: "Project/DeleteProjectCustomField/",
	iatiActivities: "IATI/GetActivities",
	iatiOrganizations: "IATI/GetOrganizations",
	iatiMatchingActivities: "IATI/GetMatchingActivities",
	iatiProjects: "IATI/GetProjects",
	getIatiSettings: "IATI/GetIATISettings",
	setIatiSettings: "IATI/SetIATISettings",
	iatiProjectsByIds: "IATI/ExtractProjectsByIds",
	aimsProjectsByIds: "Project/ExtractProjectsByIds",
	sectorProjects: "Project/GetSectorProjects/",
	sectorProjectsReport: "Report/GetSectorWiseProjects",
	locationProjectsReport: "Report/GetLocationWiseProjects",
	yearlyProjectsReport: "Report/GetYearWiseProjects",
	budgetReport: "Report/GetProjectsBudgetReport",
	budgetSummaryReport: "Report/GetProjectsBudgetSummaryReport",
	searchProjectsViewByCriteria: "Project/SearchProjectsViewByCriteria",
	searchProjectsByCriteriaReport: "Report/GetSectorWiseProjects",
	getFinancialYears: "FinancialYear",
	smtpSettings: "SMTPSettings",
	notificationsCount: "Notification/GetCount",
	notifications: "Notification",
	markNotificationsRead: "Notification/MarkNotificationsRead",
	deleteNotifications: "Notification/DeleteNotifications",
	getCurrency: "Currency",
	getCurrencyById: "Currency/GetById/",
	getDefaultCurrency: "Currency/GetDefault",
	getNationalCurrency: "Currency/GetNational",
	setDefaultCurrency: "Currency/SetDefault/",
	setNationalCurrency: "Currency/SetNational/",
	reportNamesUrl: "ReportName",
	userSubscriptionsUrl: "ReportSubscription",
	subscribeToReports: "ReportSubscription/Subscribe",
	exchangeRateUrl: "ExchangeRate",
	getExchangeRateSettingsUrl: "ExchangeRate/GetSettings",
	setExchangeRateAutoSettingsUrl: "ExchangeRate/SetExchangeRateAutoSetting",
	saveAPIKeyOpenExchange: "ExchangeRate/SaveAPIKeyForOpenExchange",
	setLabelForManualExRates: "ExchangeRate/SetLabelForManualExRates",
	saveManualExchangeRates: "ExchangeRate/SaveManualCurrencyRates",
	exchangeRateForDate: "ExchangeRate/GetRatesForDate/",
	getManualExchangeRates: "ExchangeRate/GetManualExchangeRates",
	manualExchangeRates: "ManualExchangeRate",
	manualExRatesByDate: "ManualExchangeRate/GetByDate/",
	manualExRatesForCurrency: "ManualExchangeRate/GetForNationalCurrency/",
	getDefaultSectors: "Sector/GetDefaultSectors",
	envelopeUrl: "Envelope",
	customFieldsUrl: "CustomField",
	activeCustomFieldsUrl: "CustomField/GetActive",
	customFieldProjects: "Project/GetCustomFieldProjects/",
	fundingTypeUrl: "FundingType",
	emailMessageUrl: "EmailMessage",
	getManagerUsers: "User/GetManagerUsers",
	getStandardUsers: "User/GetStandardUsers",
	sendEmailUrl: "Email/SendEmailToUsers",
	userApprovedRequests: "ProjectMembership/GetUserApprovedRequests",
	userProjects: "Project/GetUserProjects",
	projectMembershipUrl: "ProjectMembership",
	approveProjectMembership: "ProjectMembership/ApproveRequest",
	unApproveProjectMembership: "ProjectMembership/UnApproveRequest",
	importNewExcelDataUrl: "ImportData/UploadDataImportFileEighteen",
	importOldExcelDataUrl: "ImportData/UploadDataImportFileSeventeen",
	contactUrl: "Contact",
	projectEmailUrl: "Contact/SendSuggestionEmailForProject"
};