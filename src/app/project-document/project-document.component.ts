import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-project-document',
  templateUrl: './project-document.component.html',
  styleUrls: ['./project-document.component.css']
})
export class ProjectDocumentComponent implements OnInit {

  @Input()
  isBtnDisabled: boolean = false;
  btnText: string = 'Add Project Document';
  errorMessage: string = '';
  documents: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  model = { projectId: 0, documentTitle: null,  documentUrl: null };

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Add Project Document';
        this.model.projectId = id;
      } else {
        this.router.navigateByUrl('/');
      }
    }
    
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  saveProjectDocument() {
    var model = {
      ProjectId: this.model.projectId,
      DocumentTitle: this.model.documentTitle,
      DocumentUrl: this.model.documentUrl,
    };

    this.isBtnDisabled = true;
      this.btnText = 'Saving...';
      this.projectService.addProjectDocument(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New project document ' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('view-project/' + this.model.projectId);
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.errorMessage = error;
          this.isError = true;
          this.resetFormState();
        }
      );
  }

  resetFormState() {
    this.isBtnDisabled = false;
    this.btnText = 'Add Project Document';
  }

}
