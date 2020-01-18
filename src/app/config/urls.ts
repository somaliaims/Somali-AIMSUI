export const urls = {
	baseUrl: "http://104.140.103.36/api/",
	excelFilesUrl: "http://104.140.103.36/ExcelFiles/",
	dataBackupFilesUrl: "http://104.140.103.36/DataBackups/",
	//baseUrl: "http://104.140.103.166:7000/api/",
	//excelFilesUrl: "http://104.140.103.166:7000/ExcelFiles/",
	//dataBackupFilesUrl: "http://104.140.103.166:7000/DataBackups/",
	//baseUrl: "http://localhost:60815/api/",
	//excelFilesUrl: "http://localhost:60815/ExcelFiles/",
	//dataBackupFilesUrl: "http://localhost:60815/DataBackups/",
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
	organizationTypeUrl: "OrganizationType",
	organizationsForTypeUrl: "Organization/GetOrganizationsForType",
	iatiOrganizationsUrl: "Organization/GetIATIOrganizations",
	userNotificationsList: "Notification",
	userAccountActivation: "User/ActivateAccount/",
	searchOrganizations: "Organization/",
	getOrganization: "Organization/GetById/",
	organizationsWithTypeUrl: "Organization/GetWithTypes",
	organizationsHavingEnvelopeUrl: "Organization/GetOrganizationsHavingEnvelope",
	userOrganizationsUrl: "Organization/GetUserOrganizations",
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
	financialYearsRangeUrl: "FinancialYear/AddRange",
	getSector: "Sector/GetById/",
	setSectorChild: "Sector/SetChild/",
	removeSectorChild: "Sector/RemoveChild/",
	projectTypesUrl: "ProjectType",
	getProjectType: "ProjectType/GetById/",
	projectsUrl: "Project",
	projectsDetailUrl: "Project/GetAllWithDetail",
	getProject: "Project/GetById/",
	latestProjects: "Project/GetLatest",
	organizationProjects: "Project/GetOrganizationProjects/",
	locationProjects: "Project/GetLocationProjects/",
	mergeProjects: "Project/MergeProjects",
	getProjectProfileReport: "Project/GetProjectProfileReport/",
	getProjectReport: "Report/GetProjectReport/",
	getProjectTitle: "Project/GetTitle/",
	getProjectLocationsUrl: "Project/GetLocations/",
	addProjectLocation: "Project/AddProjectLocation",
	getProjectSectorsUrl: "Project/GetSectors/",
	addProjectSector: "Project/AddProjectSector",
	getProjectFundersUrl: "Project/GetFunders/",
	addProjectFunder: "Project/AddProjectFunder",
	addProjectFunderFromSource: "Project/AddProjectFunderFromSource",
	addProjectImplementerFromSource: "Project/AddProjectImplementerFromSource",
	addProjectField: "Project/AddProjectMarker",
	getProjectImplementersUrl: "Project/GetImplementers/",
	addProjectImplementer: "Project/AddProjectImplementer",
	getProjectDisbursementUrl: "Project/GetDisbursements/",
	adjustProjectDisbursementsUrl: "Project/AdjustDisbursements/",
	addProjectDisbursement: "Project/AddProjectDisbursement",
	getProjectDocumentUrl: "Project/GetDocuments/",
	addProjectDocument: "Project/AddProjectDocument",
	deleteProjectLocation: "Project/DeleteProjectLocation/",
	deleteProjectSector: "Project/DeleteProjectSector/",
	deleteProjectFunder: "Project/DeleteProjectFunder/",
	deleteProjectImplementer: "Project/DeleteProjectImplementer/",
	deleteProjectDisbursement: "Project/DeleteProjectDisbursement/",
	deleteProjectDocument: "Project/DeleteProjectDocument/",
	deleteProjectMarker: "Project/DeleteProjectMarker/",
	iatiActivities: "IATI/GetActivities",
	iatiOrganizations: "Organization/GetIATIOrganizations",
	iatiMatchingActivities: "IATI/GetMatchingActivities",
	iatiProjects: "IATI/GetProjects",
	getIatiSettings: "IATI/GetIATISettings",
	setIatiSettings: "IATI/SetIATISettings",
	iatiProjectsByIds: "IATI/ExtractProjectsByIds",
	aimsProjectsByIds: "Project/ExtractProjectsByIds",
	sectorProjects: "Project/GetSectorProjects/",
	sectorProjectsReport: "Report/GetSectorWiseProjects",
	noSectorProjectsReport: "Report/GetNoSectorProjects",
	noLocationProjectsReport: "Report/GetNoLocationProjects",
	locationProjectsReport: "Report/GetLocationWiseProjects",
	yearlyProjectsReport: "Report/GetYearWiseProjects",
	budgetReport: "Report/GetProjectsBudgetReport",
	budgetSummaryReport: "Report/GetProjectsBudgetSummaryReport",
	envelopeReport: "Report/GetEnvelopeReport",
	allProjectsReport: "Report/GetAllProjectsReport",
	searchProjectsViewByCriteria: "Project/SearchProjectsViewByCriteria",
	searchProjectsByCriteriaReport: "Report/GetSectorWiseProjects",
	getFinancialYears: "FinancialYear",
	smtpSettings: "SMTPSettings",
	notificationsCount: "Notification/GetCount",
	notifications: "Notification",
	markNotificationsRead: "Notification/MarkNotificationsRead",
	deleteNotifications: "Notification/DeleteNotifications",
	getCurrency: "Currency",
	currenciesForUserUrl: "Currency/GetForUser",
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
	averageCurrencyRate: "ExchangeRate/GetAverageCurrencyRateForDate",
	getDefaultSectors: "Sector/GetDefaultSectors",
	envelopeTypeUrl: "EnvelopeType",
	envelopeUrl: "Envelope",
	markersUrl: "Marker",
	activeMarkersUrl: "Marker/GetActive",
	markerProjects: "Project/GetMarkerProjects/",
	fundingTypeUrl: "FundingType",
	emailMessageUrl: "EmailMessage",
	getManagerUsers: "User/GetManagerUsers",
	getStandardUsers: "User/GetStandardUsers",
	sendEmailUrl: "Email/SendEmailToUsers",
	userApprovedRequests: "ProjectMembership/GetUserApprovedRequests",
	userProjects: "Project/GetUserProjects",
	projectMembershipUrl: "ProjectMembership",
	projectTitlesUrl: "Project/GetProjectTitles",
	approveProjectMembership: "ProjectMembership/ApproveRequest",
	unApproveProjectMembership: "ProjectMembership/UnApproveRequest",
	importNewExcelDataUrl: "ImportData/UploadDataImportFileEighteen",
	importOldExcelDataUrl: "ImportData/UploadDataImportFileSeventeen",
	importLatestDataUrl: "ImportData/ImportLatestData",
	importEnvelopeDataUrl: "ImportData/ImportEnvelopeData",
	importOrganizationTypesUrl: "ImportData/ImportOrganizationTypes",
	contactUrl: "Contact",
	projectEmailUrl: "Contact/SendSuggestionEmailForProject",
	deleteProjectIdsUrl: "ProjectDeletionRequest/GetProjectIds",
	projectDeletionRequestUrl: "ProjectDeletionRequest",
	projectDeletionActiveRequestsUrl: "ProjectDeletionRequest/GetActiveRequests",
	projectDeletionApprovalUrl: "ProjectDeletionRequest/ApproveRequest/",
	projectDeletionCancelUrl: "ProjectDeletionRequest/CancelRequest/",
	exchangeRateUsageUrl: "ExchangeRateUsage",
	projectsCountUrl: "Project/GetActiveProjectsCount",
	organizationsCountUrl: "Organization/GetOrganizationsCount",
	usersCountUrl: "User/GetActiveUsersCount",
	currentYearDisbursementsUrl: "Project/GetCurrentYearDisbursements",
	setHomePageSettingsUrl: "HomePage/SetSettings",
	getHomePageSettingsUrl: "HomePage/GetSettings",
	projectHelpUrl: "Help/GetProjectFields",
	projectFunderHelpUrl: "Help/GetProjectFunderFields",
	projectImplementerHelpUrl: "Help/GetProjectImplementerFields",
	projectDisbursementsHelpUrl: "Help/GetProjectDisbursementsFields",
	projectDocumentsHelpUrl: "Help/GetProjectDocumentsFields",
	projectSectorHelpUrl: "Help/GetProjectSectorFields",
	projectLocationHelpUrl: "Help/GetProjectLocationFields",
	addProjectHelpUrl: "Help/AddProjectHelp",
	addProjectFunderHelpUrl: "Help/AddProjectFunderHelp",
	addProjectImpelementerHelpUrl: "Help/AddProjectImplementerHelp",
	addProjectDisbursementHelpUrl: "Help/AddProjectDisbursementHelp",
	addProjectDocumentHelpUrl: "Help/AddProjectDocumentHelp",
	addProjectSectorHelpUrl: "Help/AddProjectSectorHelp",
	addProjectLocationHelpUrl: "Help/AddProjectLocationHelp",
	backupDataUrl: "DataBackup/PerformBackup",
	restoreDataUrl: "DataBackup/PerformRestore",
	backupFilesUrl: "DataBackup/GetBackupFiles",
	countriesUrl: "IATICountry",
	setActiveCountryUrl: "IATICountry/SetActiveCountry",
	financialYearSettingsUrl: "FinancialYearSettings"
};