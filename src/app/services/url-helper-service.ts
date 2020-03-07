import { Injectable } from '@angular/core';
import * as urlsList from "../config/urls";
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class UrlHelperService {
    BASE_URL : string; 
    
    constructor() {
        if (environment.backendApiUrl) {
            this.BASE_URL = environment.backendApiUrl;
        } else {
            this.BASE_URL = urlsList.urls.baseUrl; 
        }
    }

    getExcelFilesUrl() {
        return (urlsList.urls.excelFilesUrl);
    }

    userTokenUrl() {
        return (this.BASE_URL + urlsList.urls.getToken);
    }

    emailAvailabilityUrl(email: string) {
        return (this.BASE_URL + urlsList.urls.checkEmailAvailability + email);
    }

    userRegistrationUrl() {
        return (this.BASE_URL + urlsList.urls.userRegistration);
    }

    organizationsListUrl() {
        return (this.BASE_URL + urlsList.urls.organizationsList);
    }

    getMergeOrganizationsRequestUrl() {
        return (this.BASE_URL + urlsList.urls.organizationsMergeRequest);
    }

    getIfOrganizationsHaveUsersUrl() {
        return (this.BASE_URL + urlsList.urls.organizationsHaveUsersUrl);
    }

    getMergeOrganizationsRequestsForUserUrl() {
        return (this.BASE_URL + urlsList.urls.getOrgMergeRequestsForUser);
    }

    getApproveMergeOrganizationsRequestUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.approveOrganizationMergeRequest + id);
    }

    getRejectMergeOrganizationsRequestUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.rejectOrganizationsMergeRequest + id);
    }

    getMergeOrganizationsUrl() {
        return (this.BASE_URL + urlsList.urls.mergeOrganization);
    }

    getUserOrganizationsUrl() {
        return (this.BASE_URL + urlsList.urls.userOrganizationsUrl);
    }

    getRenameOrganizationUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.renameOrganization + id);
    }

    deleteOrganizationUrl(id: string, newId: string) {
        return (this.BASE_URL + urlsList.urls.deleteOrganization + id + '/' + newId);
    }

    deleteOrganizationTypeUrl(id: string, newId: string) {
        return (this.BASE_URL + urlsList.urls.organizationTypeUrl + '/' + id + '/' + newId);
    }

    getOrganizationProjectsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.organizationProjects + id);
    }

    organizationsFilterUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.searchOrganizations + criteria);
    }

    organizationTypesUrl() {
        return (this.BASE_URL + urlsList.urls.organizationTypesList);
    }

    getOrganizationWithTypeUrl() {
        return (this.BASE_URL + urlsList.urls.organizationsWithTypeUrl);
    }

    getNotificationsUrl() {
        return (this.BASE_URL + urlsList.urls.notifications);
    }

    getNotificationsCountUrl() {
        return (this.BASE_URL + urlsList.urls.notificationsCount);
    }

    markNotificationsReadUrl() {
        return (this.BASE_URL + urlsList.urls.markNotificationsRead);
    }

    deleteNotificationsUrl() {
        return (this.BASE_URL + urlsList.urls.deleteNotifications);
    }

    userAccountActivationUrl() {
        return (this.BASE_URL + urlsList.urls.userAccountActivation);
    }

    getSearchOrganizationUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getOrganization + id);
    }

    getEditUserPasswordUrl() {
        return (this.BASE_URL + urlsList.urls.editUserPassword);
    }

    getDeleteAccountUrl() {
        return (this.BASE_URL + urlsList.urls.deleteUserAccount);
    }

    getResetPasswordRequestUrl() {
        return (this.BASE_URL + urlsList.urls.resetPasswordRequest);
    }

    getResetPasswordUrl() {
        return (this.BASE_URL + urlsList.urls.resetPassword);
    }
    
    getOrganizationUrl() {
        return (this.BASE_URL + urlsList.urls.organizationUrl);
    }

    getAllOrganizationsUrl() {
        return (this.BASE_URL + urlsList.urls.allOrganizationsList);
    }

    getCurrencyUrl() {
        return (this.BASE_URL + urlsList.urls.getCurrency);
    }

    getCurrencyByIdUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getCurrencyById + id);
    }

    getDefaultCurrencyUrl() {
        return (this.BASE_URL + urlsList.urls.getDefaultCurrency);
    }

    getNationalCurrencyUrl() {
        return (this.BASE_URL + urlsList.urls.getNationalCurrency);
    }

    getCurrenciesForUserUrl() {
        return (this.BASE_URL + urlsList.urls.currenciesForUserUrl);
    }

    getExRateSettingsUrl() {
        return (this.BASE_URL + urlsList.urls.getExchangeRateSettingsUrl);
    }

    getManualExRatesUrl() {
        return (this.BASE_URL + urlsList.urls.manualExchangeRates);
    }

    getExRateAutoSettingsUrl() {
        return (this.BASE_URL + urlsList.urls.setExchangeRateAutoSettingsUrl);
    }

    getManualExchangeRatesUrl() {
        return (this.BASE_URL + urlsList.urls.manualExchangeRates);
    }

    getManualExchangeRatesByDateUrl(dated: string) {
        return (this.BASE_URL + urlsList.urls.manualExRatesByDate + dated);
    }

    getManualExchangeRatesForCurrency(code: string) {
        return (this.BASE_URL + urlsList.urls.manualExRatesForCurrency + code);
    }

    getExchangeRateUsageUrl() {
        return (this.BASE_URL + urlsList.urls.exchangeRateUsageUrl);
    }

    getExchangeRateUsageByIdUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.exchangeRateUsageUrl + '/' + id);
    }

    getExchangeRateUsageEditUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.exchangeRateUsageUrl + '/' + id);
    }

    saveAPIKeyOpenExchangeUrl() {
        return (this.BASE_URL + urlsList.urls.saveAPIKeyOpenExchange);
    }

    setLabelForManualExRatesUrl() {
        return (this.BASE_URL + urlsList.urls.setLabelForManualExRates);
    }

    getUpdateDefaultCurrencyUrl(id: number) {
        return (this.BASE_URL + urlsList.urls.setDefaultCurrency + id);
    }

    getUpdateNationalCurrencyUrl(id: number) {
        return (this.BASE_URL + urlsList.urls.setNationalCurrency + id);
    }

    saveManualCurrencyRatesUrl() {
        return (this.BASE_URL + urlsList.urls.saveManualExchangeRates);
    }

    getExchangeRatesUrl() {
        return (this.BASE_URL + urlsList.urls.exchangeRateUrl)
    }

    getExchangeRatesForDateUrl(dated: string) {
        return (this.BASE_URL + urlsList.urls.exchangeRateForDate + dated);
    }

    getSearchCurrencyUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.getCurrency + '/' + criteria);
    }

    getDeleteCurrencyUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getCurrency + '/' + id);
    }

    getSingleLocationUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getLocation + id);
    }

    getLocationProjectsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.locationProjects + id);
    }

    getSearchLocationsUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.locationUrl + '/' + criteria);
    }

    getLocationUrl() {
        return (this.BASE_URL + urlsList.urls.locationUrl);
    }

    deleteLocationUrl(id: string, newId: string) {
        return (this.BASE_URL + urlsList.urls.deleteLocation + id + '/' + newId);
    }

    getMarkerUrl() {
        return (this.BASE_URL + urlsList.urls.markersUrl);
    }

    getMarkerByIdUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.markersUrl + '/' + id);
    }

    getActiveMarkersUrl() {
        return (this.BASE_URL + urlsList.urls.activeMarkersUrl);
    }

    getDeleteMarkerUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.markersUrl + '/' + id);
    }

    getDeleteProjectMarkerUrl(projectId: string, markerId: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectMarker + projectId + '/' + markerId);
    }

    getFieldProjectsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.markerProjects + id);
    }

    getLatestProjectsUrl() {
        return (this.BASE_URL + urlsList.urls.latestProjects);
    }

    addProjectMarkerUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectField);
    }

    getFundingTypesUrl() {
        return (this.BASE_URL + urlsList.urls.fundingTypeUrl);
    }

    getSingleFundingTypeUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.fundingTypeUrl + '/' + id);
    } 

    getEmailMessagesUrl() {
        return (this.BASE_URL + urlsList.urls.emailMessageUrl);
    }

    getSingleEmailMessageUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.emailMessageUrl + '/' + id);
    }

    getDefaultSectorTypeUrl() {
        return (this.BASE_URL + urlsList.urls.defaultSectorTypeUrl);
    }

    getSingleSectorTypeUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getSectorType + id);
    }

    getSectorTypesUrl() {
        return(this.BASE_URL + urlsList.urls.sectorTypesUrl);
    }

    getSearchSectorTypeUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.sectorTypesUrl + '/' + criteria);
    }

    getSectorChildrenUrl(id: string) {
        return(this.BASE_URL + urlsList.urls.sectorChildren + id);
    }

    getSectorTypeUrl() {
        return (this.BASE_URL + urlsList.urls.sectorTypesUrl);
    }

    getSectorProjectsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.sectorProjects + id);
    }

    setSectorChildUrl(sectorId: string, childId: string) {
        return (this.BASE_URL + urlsList.urls.setSectorChild + sectorId + '/' + childId);
    }

    removeSectorChildUrl(sectorId: string, childId: string) {
        return (this.BASE_URL + urlsList.urls.removeSectorChild + sectorId + '/' + childId);
    }

    getSingleSectorCategoryUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getSectorCategory + id);
    }

    getSearchSectorCategoryUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.sectorCategoriesUrl + '/' + criteria);
    }

    getSectorCategoryUrl() {
        return (this.BASE_URL + urlsList.urls.sectorCategoriesUrl);
    }

    getSingleSectorSubCategoryUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getSectorSubCategory + id);
    }

    getSearchSectorSubCategoryUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.sectorSubCategoriesUrl + '/' + criteria);
    }

    getSectorSubCategoryUrl() {
        return (this.BASE_URL + urlsList.urls.sectorSubCategoriesUrl);
    }

    getSingleSectorUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getSector + id);
    }

    getSearchSectorsUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.sectorsUrl + '/' + criteria);
    }

    getSectorUrl() {
        return (this.BASE_URL + urlsList.urls.sectorsUrl);
    }

    saveSectorWithMappingUrl() {
        return (this.BASE_URL + urlsList.urls.addSectorWithMapping);
    }

    deleteSectorUrl(id: string, newId: string) {
        return (this.BASE_URL + urlsList.urls.deleteSector + id + '/' + newId);
    }

    getAllSectors() {
        return (this.BASE_URL + urlsList.urls.sectorsUrl);
    }

    getDefaultSectorsUrl() {
        return (this.BASE_URL + urlsList.urls.getDefaultSectors);
    }

    getOtherSectorTypesUrl() {
        return (this.BASE_URL + urlsList.urls.otherSectorTypesUrl);
    }

    getAllSectorMappingsUrl() {
        return (this.BASE_URL + urlsList.urls.allSectorMappingsUrl);
    }

    getSectorMappingsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.sectorMappingsUrl + id);
    }

    getSectorMappingsAddOrUpdateUrl() {
        return (this.BASE_URL + urlsList.urls.sectorMappingsAddOrUpdateUrl);
    }

    getDeleteSectorMappingsUrl(sectorId: string, mappingId: string) {
        return (this.BASE_URL + urlsList.urls.sectorMappings + '/' + sectorId + '/' + mappingId);
    }

    saveSectorMappingsUrl() {
        return (this.BASE_URL + urlsList.urls.sectorMappings);
    }

    getMappingsForSectorUrl(sectorId: string) {
        return (this.BASE_URL + urlsList.urls.mappingsForSector + sectorId);
    }

    getMappingsForSectorByNameUrl() {
        return (this.BASE_URL + urlsList.urls.mappingsForSectorByName);
    }

    getSectorsForTypeUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.sectorsForTypesUrl + id);
    }

    getSingleProjectTypeUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectType + id);
    }

    getMergeProjectsUrl() {
        return (this.BASE_URL + urlsList.urls.mergeProjects);
    }

    getSearchProjectTypesUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.projectTypesUrl + '/' + criteria);
    }

    getProjectTitlesUrl() {
        return (this.BASE_URL + urlsList.urls.projectTitlesUrl);
    }

    getProjectTypesUrl() {
        return (this.BASE_URL + urlsList.urls.projectTypesUrl);
    }

    getSingleProjectUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProject + id);
    }

    getSearchProjectsUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.projectsUrl + '/' + criteria);
    }

    getProjectUrl() {
        return (this.BASE_URL + urlsList.urls.projectsUrl);
    }

    getProjectsWithDetail() {
        return (this.BASE_URL + urlsList.urls.projectsDetailUrl);
    }

    getProjectLocationsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectLocationsUrl + id);
    }

    addProjectLocationUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectLocation);
    }

    deleteProjectLocationUrl(projectId: string, locationId: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectLocation + projectId + '/' + locationId);
    }

    getProjectSectorsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectSectorsUrl + id);
    }

    addProjectSectorUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectSector);
    }

    deleteProjectSectorUrl(projectId: string, locationId: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectSector + projectId + '/' + locationId);
    }

    getProjectFundersUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectFundersUrl + id);
    }

    addProjectFunderUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectFunder);
    }

    addProjectFunderFromSourceUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectFunderFromSource);
    }

    addProjectImplementerFromSourceUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectImplementerFromSource);
    }

    getProjectProfileReport(id) {
        return (this.BASE_URL + urlsList.urls.getProjectProfileReport + id);
    }

    getProjectReportUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectReport + '/' + id);
    }

    getAllProjectsReportUrl() {
        return (this.BASE_URL + urlsList.urls.allProjectsReport);
    }

    deleteProjectFunderUrl(projectId: string, funderId: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectFunder + projectId + '/' + funderId);
    }

    getProjectImplementersUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectImplementersUrl + id);
    }

    addProjectImplementerUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectImplementer);
    }

    deleteProjectImplementerUrl(projectId: string, implementerId: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectImplementer + projectId + '/' + implementerId);
    }

    getProjectDisbursementsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectDisbursementUrl + id);
    }

    getCreateProjectDisbursementsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.createProjectDisbursementsUrl + id);
    }

    getAdjustProjectDisbursementsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.adjustProjectDisbursementsUrl + id);
    }

    addProjectDisbursementUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectDisbursement);
    }

    deleteProjectDisbursementUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectDisbursement + id);
    }

    getProjectDocumentsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectDocumentUrl + id);
    }

    addProjectDocumentUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectDocument);
    }

    deleteProjectDocumentUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectDocument + id);
    }

    getIATIActivitiesUrl() {
        return (this.BASE_URL + urlsList.urls.iatiActivities);
    }

    getFilteredIATIActivitiesUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.iatiMatchingActivities + '/' + criteria);
    }

    getIATIOrganizationsUrl() {
        return (this.BASE_URL + urlsList.urls.iatiOrganizationsUrl);
    }

    getIATIProjectsUrl() {
        return (this.BASE_URL + urlsList.urls.iatiProjects);
    }

    getProjectTitle(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectTitle + id);
    }

    extractProjectsByIds() {
        return (this.BASE_URL + urlsList.urls.iatiProjectsByIds);
    }

    extractAIMSProjectsByIds() {
        return (this.BASE_URL + urlsList.urls.aimsProjectsByIds);
    }

    getSearchProjectsViewUrl() {
        return (this.BASE_URL + urlsList.urls.searchProjectsViewByCriteria);
    }

    getFinancialYearsUrl() {
        return (this.BASE_URL + urlsList.urls.getFinancialYears);
    }

    getFinancialYearsForEnvelopeUrl() {
        return (this.BASE_URL + urlsList.urls.envelopeFinancialYearsUrl);
    }

    getFinancialYearRangeUrl() {
        return (this.BASE_URL + urlsList.urls.financialYearsRangeUrl);
    }

    getIATISettingsUrl() {
        return (this.BASE_URL + urlsList.urls.getIatiSettings);
    }

    setIATISettingsUrl() {
        return (this.BASE_URL + urlsList.urls.setIatiSettings);
    }

    getSMTPSettingsUrl() {
        return (this.BASE_URL + urlsList.urls.smtpSettings);
    }

    getUserSubscriptionsUrl() {
        return (this.BASE_URL + urlsList.urls.userSubscriptionsUrl);
    }

    getUsersUrl() {
        return (this.BASE_URL + urlsList.urls.usersUrl);
    }

    getPromoteUserUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.promoteUserUrl + id);
    }

    getDemoteUserUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.demoteUserUrl + id);
    }

    getManagerUsersUrl() {
        return (this.BASE_URL + urlsList.urls.getManagerUsers);
    }

    getStandardUsersUrl() {
        return (this.BASE_URL + urlsList.urls.getStandardUsers);
    }

    getSendEmailUrl() {
        return (this.BASE_URL + urlsList.urls.sendEmailUrl);
    }

    //Reports url
    getSectorProjectsReportUrl() {
        return (this.BASE_URL + urlsList.urls.sectorProjectsReport);
    }

    getNoSectorProjectsReportUrl() {
        return (this.BASE_URL + urlsList.urls.noSectorProjectsReport);
    }

    getNoLocationProjectsReportUrl() {
        return (this.BASE_URL + urlsList.urls.noLocationProjectsReport);
    }

    getLocationProjectsReportUrl() {
        return (this.BASE_URL + urlsList.urls.locationProjectsReport);
    }

    getYearlyProjectsReportUrl() {
        return(this.BASE_URL + urlsList.urls.yearlyProjectsReport);
    }

    getSearchProjectsReportUrl() {
        return (this.BASE_URL + urlsList.urls.searchProjectsByCriteriaReport);
    }

    getBudgetReportUrl() {
        return (this.BASE_URL + urlsList.urls.budgetReport);
    }

    getBudgetSummaryReportUrl() {
        return (this.BASE_URL + urlsList.urls.budgetSummaryReport);
    }

    getEnvelopeReportUrl() {
        return (this.BASE_URL + urlsList.urls.envelopeReport);
    }

    getReportNamesUrl() {
        return (this.BASE_URL + urlsList.urls.reportNamesUrl);
    }

    getSubscribeToReportsUrl() {
        return (this.BASE_URL + urlsList.urls.subscribeToReports);
    }

    getFunderEnvelopeUrl() {
        return(this.BASE_URL + urlsList.urls.envelopeUrl);
    }

    getEnvelopeTypeUrl() {
        return (this.BASE_URL + urlsList.urls.envelopeTypeUrl);
    }

    getEnvelopeUrl() {
        return (this.BASE_URL + urlsList.urls.envelopeUrl);
    }

    getUserApprovedRequestsUrl() {
        return (this.BASE_URL + urlsList.urls.userApprovedRequests);
    }

    getUserProjectsUrl() {
        return (this.BASE_URL + urlsList.urls.userProjects);
    }

    getProjectMembershipUrl() {
        return (this.BASE_URL + urlsList.urls.projectMembershipUrl);
    }

    applyForProjectMembershipUrl(id) {
        return (this.BASE_URL + urlsList.urls.projectMembershipUrl + '/' + id);
    }

    approveProjectMembershipUrl() {
        return (this.BASE_URL + urlsList.urls.approveProjectMembership);
    }
    
    unApproveProjectMembershipUrl() {
        return (this.BASE_URL + urlsList.urls.unApproveProjectMembership);
    }

    getOldExcelImportUrl() {
        return (this.BASE_URL + urlsList.urls.importOldExcelDataUrl);
    }

    getNewExcelImportUrl() {
        return (this.BASE_URL + urlsList.urls.importNewExcelDataUrl);
    }

    getLatestExcelImportUrl() {
        return (this.BASE_URL + urlsList.urls.importLatestDataUrl);
    }

    getEnvelopeDataImportUrl() {
        return (this.BASE_URL + urlsList.urls.importEnvelopeDataUrl);
    }

    getOrganizationTypesImportUrl() {
        return (this.BASE_URL + urlsList.urls.importOrganizationTypesUrl);
    }

    getDataBackupUrl() {
        return (this.BASE_URL + urlsList.urls.backupDataUrl);
    }

    getDeleteBackupUrl() {
        return (this.BASE_URL + urlsList.urls.deleteBackupUrl);
    }

    getDataRestoreUrl() {
        return (this.BASE_URL + urlsList.urls.restoreDataUrl);
    }

    getBackupFilesUrl() {
        return (this.BASE_URL + urlsList.urls.backupFilesUrl);
    }

    getCountriesUrl() {
        return (this.BASE_URL + urlsList.urls.countriesUrl);
    }

    setActiveCountryUrl(code: string) {
        return (this.BASE_URL + urlsList.urls.setActiveCountryUrl + '/' + code);
    }

    averageCurrencyRateForDateUrl() {
        return (this.BASE_URL + urlsList.urls.averageCurrencyRate);
    }

    getContactUrl() {
        return (this.BASE_URL + urlsList.urls.contactUrl);
    }

    getProjectContactUrl() {
        return (this.BASE_URL + urlsList.urls.projectEmailUrl);
    }

    getDeleteProjectIdsUrl() {
        return (this.BASE_URL + urlsList.urls.deleteProjectIdsUrl);
    }

    getProjectDeletionRequestUrl() {
        return (this.BASE_URL + urlsList.urls.projectDeletionRequestUrl);
    }

    getProjectDeletionActiveRequestsUrl() {
        return (this.BASE_URL + urlsList.urls.projectDeletionActiveRequestsUrl);
    }

    getProjectDeletionApprovalUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.projectDeletionApprovalUrl + id);
    }

    getProjectDeletionCancelUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.projectDeletionCancelUrl + id);
    }

    getUsersCountUrl() {
        return (this.BASE_URL + urlsList.urls.usersCountUrl);
    }

    getProjectsCountUrl() {
        return (this.BASE_URL + urlsList.urls.projectsCountUrl);
    }

    getOrganizationsCountUrl() {
        return (this.BASE_URL + urlsList.urls.organizationsCountUrl);
    }

    getOrganizationsForTypeUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.organizationsForTypeUrl + '/' + id);
    }

    getOrganizationHavingEnvelopeUrl() {
        return (this.BASE_URL + urlsList.urls.organizationsHavingEnvelopeUrl);
    }

    getCurrentYearDisbursementsUrl() {
        return (this.BASE_URL + urlsList.urls.currentYearDisbursementsUrl);
    }

    setHomePageSettingsUrl() {
        return (this.BASE_URL + urlsList.urls.setHomePageSettingsUrl);
    }

    getHomePageSettingsUrl() {
        return (this.BASE_URL + urlsList.urls.getHomePageSettingsUrl);
    }

    getProjectHelpUrl() {
        return (this.BASE_URL + urlsList.urls.projectHelpUrl);
    }

    getProjectFunderHelpUrl() {
        return (this.BASE_URL + urlsList.urls.projectFunderHelpUrl);
    }

    getProjectSectorHelpUrl() {
        return (this.BASE_URL + urlsList.urls.projectSectorHelpUrl);
    }

    getProjectLocationHelpUrl() {
        return (this.BASE_URL + urlsList.urls.projectLocationHelpUrl);
    }

    getProjectImplementerHelpUrl() {
        return (this.BASE_URL + urlsList.urls.projectImplementerHelpUrl);
    }

    getProjectDisbursementsHelpUrl() {
        return (this.BASE_URL + urlsList.urls.projectDisbursementsHelpUrl);
    }

    getProjectDocumentsHelpUrl() {
        return (this.BASE_URL + urlsList.urls.projectDocumentsHelpUrl);
    }

    getSaveProjectHelpUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectHelpUrl);
    }

    getSaveProjectFunderHelpUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectFunderHelpUrl);
    }

    getSaveProjectSectorHelpUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectSectorHelpUrl);
    }

    getSaveProjectLocationHelpUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectLocationHelpUrl);
    }

    getSaveProjectImplementerHelpUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectImpelementerHelpUrl);
    }

    getSaveProjectDisbursementHelpUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectDisbursementHelpUrl);
    }

    getSaveProjectDocumentHelpUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectDocumentHelpUrl);
    }

    getFinancialYearSettingsUrl() {
        return (this.BASE_URL + urlsList.urls.financialYearSettingsUrl);
    }

}