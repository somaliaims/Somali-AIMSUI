export const Settings = {
    secretKey: "XYT!M#U7QER&$$U098!",
    userPermissions: {
        manager: {
            canDo: true,
        }
        ,
        standard: {
            canDo: true
        }
    },
    dropDownMenus: {
        home: 1,
        entry: 2,
        projects: 3,
        management: 4,
        reports: 5,
        contact: 6,
        help: 7,
        notifications: 8,
        backup: 9
    },
    dropDownMenusConstants: {
        HOME: 1,
        DATA_ENTRY: 2,
        PROJECTS: 3,
        MANAGEMENT: 4,
        REPORTS: 5,
        CONTACT: 6,
        HELP: 7,
        NOTIFICATIONS: 8,
        BACKUP: 9
    },
    pdfPrintPageHeight: 1550,
    pdfPrintPageHeightLandscape: 1250,
    pdfPrintPageHeightLarge: 2200,
    rowsPerPage: 10,
    yearLimit: 100,
    descriptionLowLimit: 500,
    descriptionMediumLimit: 800,
    descriptionLongLimit: 3000,
    introductionLimit: 1000,
    mediumRowsPerPage: 20,
    displayMessageTime: 10000,
    helpTextLength: 150,
    entryTabConstants: {
        BASIC: 1,
        FINANCIALS: 2,
        SECTORS: 3,
        FINISH: 4
    },
    months: [
        { id: 1, month: 'January' },
        { id: 2, month: 'February' },
        { id: 3, month: 'March' },
        { id: 4, month: 'April' },
        { id: 5, month: 'May' },
        { id: 6, month: 'June' },
        { id: 7, month: 'July' },
        { id: 8, month: 'August' },
        { id: 9, month: 'September' },
        { id: 10, month: 'October' },
        { id: 11, month: 'November' },
        { id: 12, month: 'December' },
    ],
    permissions: {
        standard: {
            canManage: false,
            canEditCurrency: false,
            canEditOrganization: false,
            canEditLocation: false,
            canEditSectorType: false,
            canEditSectorCategory: false,
            canEditSectorSubCategory: false,
            canEditSector: false,
            canEditProject: true,
            canEditYear: false,
            canDoSMTPSettings: false,
            canDoIATISettings: false,
            canDoHomePageSettings: false,
            canEditEnvelopeType: false,
            canEditEnvelope: true,
            canEditCustomFields: false,
            canEditFundingType: false,
            canEditEmailMessage: false,
            canEditNotifications: true,
            canEditHelp: false,
            canTakeBackup: false
        },
        manager: {
            canManage: true,
            canEditCurrency: true,
            canEditOrganization: true,
            canEditLocation: true,
            canEditSectorType: true,
            canEditSectorCategory: true,
            canEditSectorSubCategory: true,
            canEditSector: true,
            canEditProject: true,
            canEditYear: true,
            canDoSMTPSettings: true,
            canDoIATISettings: true,
            canDoHomePageSettings: true,
            canEditEnvelopeType: true,
            canEditEnvelope: true,
            canEditCustomFields: true,
            canEditFundingType: true,
            canEditEmailMessage: true,
            canEditNotifications: true,
            canEditHelp: true,
            canTakeBackup: true
        },
        superAdmin: {
            canManage: true,
            canEditCurrency: true,
            canEditOrganization: true,
            canEditLocation: true,
            canEditSectorType: true,
            canEditSectorCategory: true,
            canEditSectorSubCategory: true,
            canEditSector: true,
            canEditProject: true,
            canEditYear: true,
            canDoSMTPSettings: true,
            canDoIATISettings: true,
            canDoHomePageSettings: true,
            canEditEnvelopeType: true,
            canEditEnvelope: true,
            canEditCustomFields: true,
            canEditFundingType: true,
            canEditEmailMessage: true,
            canEditNotifications: true,
            canEditHelp: true,
            canTakeBackup: true
        },
        guest: {
            canManage: false,
            canEditCurrency: false,
            canEditOrganization: false,
            canEditLocation: false,
            canEditSectorType: false,
            canEditSectorCategory: false,
            canEditSectorSubCategory: false,
            canEditSector: false,
            canEditProject: false,
            canEditYear: false,
            canDoSMTPSettings: false,
            canDoIATISettings: false,
            canDoHomePageSettings: false,
            canEditEnvelopeType: false,
            canEditEnvelope: false,
            canEditCustomFields: false,
            canEditFundingType: false,
            canEditEmailMessage: false,
            canEditNotifications: false,
            canEditHelp: false,
            canTakeBackup: false
        }
    },
    markerTypes: [
        {
            'typeId': null,
            'field': '--Select One--'
        },
        {
            'typeId': 1,
            'field': 'Dropdown'
        },
        {
            'typeId': 2,
            'field': 'Checkbox'
        },
        {
            'typeId': 3,
            'field': 'Text'
        },
        {
            'typeId': 4,
            'field': 'Radio'
        },

    ],
}