import { Component, OnInit, OnChanges, Input, ChangeDetectorRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FundingTypeService } from 'src/app/services/funding-type.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { FundingService } from 'src/app/services/funding.service';
import { FinancingModel } from 'src/app/models/FinancingModel';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { ProjectInfoModalComponent } from 'src/app/project-info-modal/project-info-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrl: './funding.component.css'
})
export class FundingComponent implements OnInit, OnChanges {
  // Inputs from parent (data-entry component)
  @Input()
  projectData: any = {};

  @Input()
  projectFunders: any[] = [];

  private _selectedFunders: any[] = [];
  @Input()
  set selectedFunders(value: any[]) {
    this._selectedFunders = value;
  }
  get selectedFunders(): any[] {
    return this._selectedFunders;
  }

  @BlockUI() blockUI!: NgBlockUI;

  @Input()
  organizationsList: any[] = [];

  @Input()
  fundingTypesList: any[] = [];

  @Input()
  currency: any;

  @Input()
  projectId: number = 0;

  @Input()
  currenciesList: any[] = [];

  @Output()
  fundingRowsChanged = new EventEmitter<any[]>();

  @Output()
  proceedToFinancials = new EventEmitter();
  
  fundingCurrencyFullName: string = '';

  // Form model
  fundingModel: Partial<FinancingModel> = {
    funderId: undefined,
    projectId: undefined,
    fundingTypeId: undefined,
    fundingCurrencyId: undefined,
    fundingAmount: undefined
  };

  // Data list to store added rows
  fundingList: FinancingModel[] = [];
  fundingTempId: number = 0;
  firstRowAdded: boolean = false;
  errorMessage: string = '';
  infoMessage: string = '';
  isSaved: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private fundingTypeService: FundingTypeService,
    private currencyService: CurrencyService,
    private fundingService: FundingService,
    private errorModal: ErrorModalComponent,
    private infoModal: ProjectInfoModalComponent
  ) { }

  ngOnInit(): void {
    // Initialize form with all @Inputs now populated
    this.initializeForm();

    // Fetch funding types and currencies from API
    this.getFundingTypes();
    this.getCurrencies();

    if (this.projectId && this.projectId > 0) {
      this.loadFinancings();
    }
    console.log(this.projectData)
    //console.log(this.fundingTypesList)
  }

  loadFinancings(): void {
    this.fundingService.getFundingByProjectId(this.projectId).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.fundingList = res.data;
          if (this.fundingList.length > 0) {
            this.isSaved = true; // Existing financings are already saved.
            this.firstRowAdded = true;
          }
          this.enrichAndEmitFundingList();
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load financings: ' + err;
        this.errorModal.openModal()
      }
    });
  }

  /**
   * Initialize form with data from basic-data component
   */
  initializeForm(): void {
    this.applyBasicDataDefaults();

    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectData && changes.projectData.currentValue) {
      this.applyBasicDataDefaults();
    }

    if (changes.selectedFunders && changes.selectedFunders.currentValue) {
      this.applyBasicDataDefaults();
    }
  }

  private applyBasicDataDefaults(): void {
    if (this.projectId && this.projectId > 0) {
      this.fundingModel.projectId = this.projectId;
    }

    if (this.projectData?.fundingTypeId != null) {
      this.fundingModel.fundingTypeId = Number(this.projectData.fundingTypeId);
    }

    if (this.projectData?.projectCurrency) {
      this.fundingModel.currency = this.projectData.projectCurrency;
      this.fundingModel.fundingCurrencyId = this.getCurrencyIdFromCurrencyCode(this.fundingModel.currency);
      this.fundingCurrencyFullName = this.getCurrencyName();
    }

    if (!this.firstRowAdded && this._selectedFunders && this._selectedFunders.length > 0) {
      const firstFunder = this._selectedFunders[0];
      const searchName = firstFunder.organizationName;

      if (searchName && this.organizationsList && this.organizationsList.length > 0) {
        let matchedOrg = this.organizationsList.find(o => o.name === searchName);
        if (!matchedOrg) matchedOrg = this.organizationsList.find(o => o.organizationName === searchName);
        if (!matchedOrg) matchedOrg = this.organizationsList.find(o => o.title === searchName);
        if (!matchedOrg) matchedOrg = this.organizationsList.find(o => o.orgName === searchName);

        if (matchedOrg) {
          this.fundingModel.funderId = matchedOrg.id;
        }
      }
    }
  }

  getCurrencyIdFromCurrencyCode(currencyCode: string | undefined): number {
    return this.currenciesList.find(c => c.currency == currencyCode)?.id ?? 0;
  }

  /**
   * Check if organization field should be disabled
   */
  isOrganizationDisabled(): boolean {
    // Disable organization only if no rows have been added yet (for first row)
    return this.fundingList.length === 0;
  }

  /**
   * Check if funding type field should be disabled
   */
  isFundingTypeDisabled(): boolean {
    // Disable funding type only for the first row and when it is available from basic data
    return this.fundingList.length === 0 && !!this.projectData?.fundingTypeId;
  }

  /**
   * Check if project field should be disabled
   */
  isProjectDisabled(): boolean {
    // Always disable project field
    return true;
  }

  /**
   * Get project name for display
   */
  getProjectName(): string {
    if (this.projectData && this.projectData.title) {
      return this.projectData.title;
    }
    return '';
  }

  getFundingName(): string {
    if (this.fundingModel?.fundingTypeId && this.fundingTypesList) {
      const match = this.fundingTypesList.find(
        f => f.id == this.fundingModel.fundingTypeId
      );
      return match ? match.fundingType : '';
    }
    return '';
  }

  /**
   * Get organization name by ID
   */
  getOrganizationName(orgId: number): string {
    if (!this.organizationsList || !orgId) return '';
    const org = this.organizationsList.find(o => o.id == orgId);
    // Try different property names
    return org ? (org.name || org.organizationName || org.title || org.orgName || '') : '';
  }

  /**
   * Get funding type name by ID
   */
  getFundingTypeName(id: number): string {
    const type = this.fundingTypesList.find(f => f.id == id);
    return type ? type.fundingType : '';
  }

  /**
   * Get currency code by ID
   */
  getCurrencyCode(id: number): string {
    const curr = this.currenciesList.find(c => c.id == id);
    return curr ? curr.currency : '';
  }

  /**
   * Add new funding entry to the list
   */
  addFunding(): void {
    // Validation
    if (!this.fundingModel.funderId) {
      this.errorMessage = 'Organization is required';
      this.errorModal.openModal()
      return;
    }
    if (!this.fundingModel.projectId) {
      this.errorMessage = 'Project is required';
      this.errorModal.openModal()
      return;
    }
    if (!this.fundingModel.fundingTypeId) {
      this.errorMessage = 'Funding type is required';
      this.errorModal.openModal()
      return;
    }
    if (!this.fundingModel.fundingCurrencyId) {
      this.errorMessage = 'Currency is required';
      this.errorModal.openModal()
      return;
    }
    if (!this.fundingModel.fundingAmount || this.fundingModel.fundingAmount <= 0) {
      this.errorMessage = 'Funding amount is required and must be greater than 0';
      this.errorModal.openModal()
      return;
    }
    if (this.fundingModel.fundingAmount > this.projectData.projectValue || this.checkAlreadyFundingsSum()) {
      this.errorMessage = 'Funding value cannot be greater than the project value'
      this.errorModal.openModal()
      return;
    }

    // Create new funding object
    const newFunding: FinancingModel = {
      id: (--this.fundingTempId),
      funderId: Number(this.fundingModel.funderId),
      projectId: Number(this.fundingModel.projectId),
      fundingTypeId: Number(this.fundingModel.fundingTypeId),
      fundingCurrencyId: Number(this.fundingModel.fundingCurrencyId),
      fundingAmount: Number(this.fundingModel.fundingAmount)
    };



    // Add to list
    this.fundingList.unshift(newFunding);
    this.firstRowAdded = true;

    // Notify parent of funding rows change
    this.enrichAndEmitFundingList();

    // Clear form but keep project and organization enabled for next rows
    this.resetFundingForm();
  }
  checkAlreadyFundingsSum(): boolean {
    var sumOfFundings = 0
    if (this.fundingList) {
      this.fundingList.forEach(f => {
        sumOfFundings += f.fundingAmount
      });
      if ((this.fundingModel.fundingAmount ?? 0) > ((this.projectData?.projectValue ?? 0) - sumOfFundings)) {
        return true
      }
      else return false
    }
    else return false
  }
  /**
   * Remove funding entry from the list
   */
  removeFunding(id: number): void {
    if (confirm('Are you sure you want to delete this funding entry?')) {
      if (id && id > 0) { // existing database record
        this.fundingService.deleteFunding(id).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.removeFundingLocally(id);
            } else {
              this.errorMessage = res.message;
              this.errorModal.openModal()
            }
          },
          error: (err) => {
            this.errorMessage = 'Something went wrong while deleting funding';
            this.errorModal.openModal()
          }
        });
      } else {
        // Just a local row, newly added
        this.removeFundingLocally(id);
      }
    }
  }

  private removeFundingLocally(id: number): void {
    this.fundingList = this.fundingList.filter(f => f.id !== id);

    // If all rows are removed, reset the firstRowAdded flag to disable organization again
    if (this.fundingList.length === 0) {
      this.firstRowAdded = false;
      this.resetFundingForm();
    }

    // Notify parent of funding rows change
    this.enrichAndEmitFundingList();
  }

  private enrichAndEmitFundingList(): void {
    this.fundingList.forEach(f => {
      f.funderName = this.getOrganizationName(f.funderId);
      f.currency = this.getCurrencyCode(f.fundingCurrencyId);
    });
    this.fundingRowsChanged.emit(this.fundingList);
  }

  /**
   * Reset funding form to default values
   */
  resetFundingForm(): void {
    this.fundingModel = {
      funderId: undefined,
      projectId: this.projectId > 0 ? this.projectId : undefined, // Keep project ID if valid
      fundingTypeId: undefined,
      fundingAmount: undefined,
      fundingCurrencyId: this.fundingModel.fundingCurrencyId ?? undefined //keep currency if not null
    };
    console.log('funding model in reset', this.fundingModel)

    if (!this.firstRowAdded) {
      this.applyBasicDataDefaults();
    }
  }

  /**
   * Fetch funding types from API
   */
  getFundingTypes() {
    this.fundingTypeService.getFundingTypesList().subscribe(
      data => {
        if (data) {
          this.fundingTypesList = data;
        }
      }
    );
  }

  getCurrencyName(): string {
    if (this.fundingModel.currency && this.fundingModel.fundingCurrencyId) {
      return this.fundingModel.currency + ' - ' + (this.currenciesList.find(c => c.id == this.fundingModel.fundingCurrencyId)?.currencyName || '');
    }
    return '';
  }
  /**
   * Fetch currencies from API
   */
  getCurrencies() {
    this.currencyService.getCurrenciesList().subscribe(
      data => {
        if (data) {
          this.currenciesList = data;
        }
      }
    );
  }

  /**
   * Handle Next button click - Proceed to next section
   * Validates that at least one funding entry exists
   */
  proceedToNext() {
    if (this.fundingList.length === 0) {
      this.errorMessage = 'Please add at least one funding entry before proceeding.';
      this.errorModal.openModal()
      return;
    }
    else if(!this.isSaved) {
      this.errorMessage = 'Please save the funding entries before proceeding.';
      this.errorModal.openModal()
      return;
    }
    else {
      this.proceedToFinancials.emit()
    }
  }

  /**
   * Handle Save Data button click - Save current funding data
   */
  saveData() {

    this.blockUI.start('Saving Fundings...')
    const newFundings = this.fundingList.filter(f => !f.id || f.id <= 0);
    if (newFundings.length === 0) {
      this.blockUI.stop()
      this.errorMessage = 'No new funding entries to save.';
      this.errorModal.openModal()
      return;
    }
    // Reset IDs so Entity Framework generates them
    const payload: FinancingModel[] = newFundings.map(f => ({
      ...f,
      id: 0
    }));

    this.fundingService.addFunding(payload).pipe(
      finalize(()=>{
        this.blockUI.stop()
      })

    ).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.isSaved = true;
          // Merge newly inserted rows back with the existing ones
          const existingList = this.fundingList.filter(f => f.id && f.id > 0);
          this.fundingList = [...res.data, ...existingList];
          this.enrichAndEmitFundingList();

          this.infoMessage = 'Funding saved successfully';
          this.infoModal.openModal()
          

        } else {
          this.errorMessage = 'API Error: ' + res.message;
          this.errorModal.openModal()
        }
      },
      error: (err) => {
        this.errorMessage = 'Something went wrong while saving funding: ' + err;
        this.errorModal.openModal()
      }
    });

  }
}
