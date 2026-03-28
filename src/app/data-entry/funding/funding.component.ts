import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FundingTypeService } from 'src/app/services/funding-type.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { FundingService } from 'src/app/services/funding.service';
import { FinancingModel } from 'src/app/models/FinancingModel';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrl: './funding.component.css'
})
export class FundingComponent implements OnInit {
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

  @Input()
  organizationsList: any[] = [];

  @Input()
  fundingTypesList: any[] = [];

  @Input()
  currenciesList: any[] = [];

  @Input()
  projectId: number = 0;

  @Output()
  fundingRowsChanged = new EventEmitter<any[]>();

  @Output()
  proceedToFinancials = new EventEmitter();

  // Form model
  fundingModel: Partial<FinancingModel> = {
    funderId: undefined,
    projectId: undefined,
    fundingStartDte: undefined,
    fundingEndDte: undefined,
    fundingTypeId: undefined,
    fundingCurrencyId: undefined,
    fundingAmount: undefined
  };

  // Data list to store added rows
  fundingList: FinancingModel[] = [];
  fundingTempId: number = 0;
  firstRowAdded: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private fundingTypeService: FundingTypeService,
    private currencyService: CurrencyService,
    private fundingService: FundingService
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
  }

  loadFinancings(): void {
    this.fundingService.getFundingByProjectId(this.projectId).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          // Format dates to remove time portion if necessary
          this.fundingList = res.data.map((f: any) => {
            if (f.fundingStartDte && f.fundingStartDte.indexOf('T') > -1) {
              f.fundingStartDte = f.fundingStartDte.split('T')[0];
            }
            if (f.fundingEndDte && f.fundingEndDte.indexOf('T') > -1) {
              f.fundingEndDte = f.fundingEndDte.split('T')[0];
            }
            return f;
          });

          if (this.fundingList.length > 0) {
            this.firstRowAdded = true;
          }
          this.enrichAndEmitFundingList();
        }
      },
      error: (err) => {
        console.error('Failed to load financings:', err);
      }
    });
  }

  /**
   * Initialize form with data from basic-data component
   */
  initializeForm(): void {
    // Pre-fill project from projectId (passed from parent data-entry component)
    if (this.projectId && this.projectId > 0) {
      this.fundingModel.projectId = this.projectId;
    }

    // Pre-fill organization from selectedFunders by matching NAME
    if (this._selectedFunders && this._selectedFunders.length > 0) {
      const firstFunder = this._selectedFunders[0];

      if (firstFunder) {
        const searchName = firstFunder.organizationName;

        if (searchName && this.organizationsList && this.organizationsList.length > 0) {
          // Try to find by different property names
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

    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  /**
   * Check if organization field should be disabled
   */
  isOrganizationDisabled(): boolean {
    // Disable organization only if no rows have been added yet (for first row)
    return this.fundingList.length === 0;
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
   * Get today's date in YYYY-MM-DD format for date picker min attribute
   */
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Add new funding entry to the list
   */
  addFunding(): void {
    // Validation
    if (!this.fundingModel.funderId) {
      alert('Organization is required');
      return;
    }
    if (!this.fundingModel.projectId) {
      alert('Project is required');
      return;
    }
    if (!this.fundingModel.fundingStartDte) {
      alert('Funding start date is required');
      return;
    }
    if (!this.fundingModel.fundingEndDte) {
      alert('Funding end date is required');
      return;
    }
    if (!this.fundingModel.fundingTypeId) {
      alert('Funding type is required');
      return;
    }
    if (!this.fundingModel.fundingCurrencyId) {
      alert('Currency is required');
      return;
    }
    if (!this.fundingModel.fundingAmount || this.fundingModel.fundingAmount <= 0) {
      alert('Funding amount is required and must be greater than 0');
      return;
    }

    // Create new funding object
    const newFunding: FinancingModel = {
      id: (--this.fundingTempId),
      funderId: Number(this.fundingModel.funderId),
      projectId: Number(this.fundingModel.projectId),
      fundingStartDte: this.fundingModel.fundingStartDte!,
      fundingEndDte: this.fundingModel.fundingEndDte!,
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

  /**
   * Remove funding entry from the list
   */
  removeFunding(id: number): void {
    console.log('id to be deleted', id)
    if (confirm('Are you sure you want to delete this funding entry?')) {
      if (id && id > 0) { // existing database record
        this.fundingService.deleteFunding(id).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.removeFundingLocally(id);
            } else {
              alert(res.message);
            }
          },
          error: (err) => {
            alert('Something went wrong while deleting funding');
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
      fundingStartDte: undefined,
      fundingEndDte: undefined,
      fundingTypeId: undefined,
      fundingCurrencyId: undefined,
      fundingAmount: undefined
    };

    // If this is the first row, pre-fill organization again from selectedFunders
    if (!this.firstRowAdded && this._selectedFunders && this._selectedFunders.length > 0) {
      const firstFunder = this._selectedFunders[0];
      const searchName = firstFunder.organizationName;

      if (searchName && this.organizationsList && this.organizationsList.length > 0) {
        // Try different property names
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
      alert('Please add at least one funding entry before proceeding.');
      return;
    }
    else {
      this.proceedToFinancials.emit()
    }
    // Emit event to parent component to proceed to next tab
    // Parent component will handle navigation based on the event
  }

  /**
   * Handle Save Data button click - Save current funding data
   */
  saveData() {
    //block UI code
    const newFundings = this.fundingList.filter(f => !f.id || f.id <= 0);

    if (newFundings.length === 0) {
      alert('No new funding entries to save.');
      return;
    }

    // Reset IDs so Entity Framework generates them
    const payload: FinancingModel[] = newFundings.map(f => ({
      ...f,
      id: 0
    }));

    this.fundingService.addFunding(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log('Inserted Financings:', res.data);

          // Merge newly inserted rows back with the existing ones
          const existingList = this.fundingList.filter(f => f.id && f.id > 0);
          this.fundingList = [...res.data, ...existingList];
          this.enrichAndEmitFundingList();

          alert('Funding saved successfully');
        } else {
          console.error('API Error:', res.message);
          alert(res.message);
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        alert('Something went wrong while saving funding');
      }
    });

  }
}
