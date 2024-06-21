import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AppModuleConstants } from 'src/app/app-constants';
import { VendorService } from 'src/app/services/vendor.service';
import { CombineCategoryDialogComponent } from '../../template/newtemplate/template-demo/combine-category-dialog/combine-category-dialog.component';
import { EditOperationDialogComponent } from '../../template/newtemplate/template-demo/edit-operation-dialog/edit-operation-dialog.component';
import {
  Category,
  ProductDEMO,
} from '../../template/newtemplate/template-demo/product-interface';
import { SearchOperationDialogComponent } from '../../template/newtemplate/template-demo/search-operation-dialog/search-operation-dialog.component';
import { TemplatebuilderService } from '../../template/newtemplate/templatebuilder.service';
import { TemplateService } from 'src/app/business-user/template/template.service';
import { ProposalService } from 'src/app/business-user/proposal/proposal.service';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from 'src/app/services/notification.service';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';
@Component({
  selector: 'app-view-proposal',
  templateUrl: './view-proposal.component.html',
  styleUrls: ['./view-proposal.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ViewProposalComponent implements OnInit {
  templateForm!: FormGroup;
  commentForm!: FormGroup;

  @ViewChild('viewCommentOverlay', { static: false })
  viewCommentOverlay!: OverlayPanel;
  @ViewChild('commentInput') commentInput!: ElementRef;

  categoriesData: any = [];
  productsData!: ProductDEMO[];
  categories!: Category[];

  selectedTemplateData: any;
  loadView: boolean = false;
  userRole!: any;
  userId!: any;
  access: any = [];
  selectedVendor: any;
  vendorList: any;
  viewType!: string;
  commentData: any = [];
  viewComment: boolean = false;
  issueType!: string;
  allDecryptedvendorData:any
  disableField: boolean = false;
  private environment = {
    cIter: 1000,
    kSize: 128,
    kSeparator: '::',
    val1: 'abcd65443A',
    val2: 'AbCd124_09876',
    val3: 'sa2@3456s',
  };

  constructor(
    private location: Location,
    private templateService: TemplateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public templateBuilderService: TemplatebuilderService,
    private proposalService: ProposalService,
    private vendorservice: VendorService,
    private projectService: ProjectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private notificationService:NotificationService
  ) {}

  ngOnInit(): void {
    this.userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    this.userId = sessionStorage.getItem(AppModuleConstants.USER)!;
    this.disableField = false;

    this.access['optionButton'] = {
      view: false,
    };

    this.templateService.getCategoriesData().subscribe((categgoryData: any) => {
      this.categoriesData =
        this.templateService.transformCategoryData(categgoryData);
      this.getData();
    });
  }

  private pullNodeCommentCount(templateId: number) {
    this.templateService
      .getNodeCommentsAll(templateId)
      .subscribe((commentData: any) => {
        // console.log('commentData: ', commentData);
        this.populateComments(commentData);
      });
  }

  private populateComments(commentData: any) {
    this.getCategoryControls().value.forEach(
      (category: any, categoryIndex: number) => {
        let mappedData = this.templateService.filterCommentData(
          category.nodeId,
          commentData
        );
        if (mappedData) {
          this.getCategoryControls()
            ?.at(categoryIndex)
            .get('badgeCount')
            ?.patchValue(mappedData.commentCount);
        }
        category.subcategory.forEach(
          (subCategory: any, subCategoryIndex: number) => {
            let mappedData = this.templateService.filterCommentData(
              subCategory.nodeId,
              commentData
            );
            if (mappedData) {
              this.getSubCategoryControls(categoryIndex)
                ?.at(subCategoryIndex)
                .get('badgeCount')
                ?.patchValue(mappedData.commentCount);
            }
            subCategory.subcategoryTwo.forEach(
              (subCategoryTwo: any, subCategoryTwoIndex: number) => {
                let mappedData = this.templateService.filterCommentData(
                  subCategoryTwo.nodeId,
                  commentData
                );
                if (mappedData) {
                  this.getSubCategoryTwoControls(
                    categoryIndex,
                    subCategoryIndex
                  )
                    ?.at(subCategoryTwoIndex)
                    .get('badgeCount')
                    ?.patchValue(mappedData.commentCount);
                }

                subCategoryTwo.subcategoryThree.forEach(
                  (subcategoryThree: any, subCategoryThreeIndex: number) => {
                    let mappedData = this.templateService.filterCommentData(
                      subcategoryThree.nodeId,
                      commentData
                    );
                    if (mappedData) {
                      this.getSubCategoryThreeControls(
                        categoryIndex,
                        subCategoryIndex,
                        subCategoryTwoIndex
                      )
                        ?.at(subCategoryThreeIndex)
                        .get('badgeCount')
                        ?.patchValue(mappedData.commentCount);
                    }

                    subcategoryThree.parameter.forEach(
                      (parameter: any, parameterIndex: number) => {
                        let mappedData = this.templateService.filterCommentData(
                          parameter.nodeId,
                          commentData
                        );
                        if (mappedData) {
                          this.getParameterControls(
                            categoryIndex,
                            subCategoryIndex,
                            subCategoryTwoIndex,
                            subCategoryThreeIndex
                          )
                            ?.at(parameterIndex)
                            .get('badgeCount')
                            ?.patchValue(mappedData.commentCount);
                        }
                        parameter.schoringcriteria.forEach(
                          (
                            schoringcriteria: any,
                            schoringcriteriaIndex: number
                          ) => {
                            let mappedData =
                              this.templateService.filterCommentData(
                                schoringcriteria.nodeId,
                                commentData
                              );
                            if (mappedData) {
                              this.getScoringCriteriaControls(
                                categoryIndex,
                                subCategoryIndex,
                                subCategoryTwoIndex,
                                subCategoryThreeIndex,
                                parameterIndex
                              )
                                ?.at(schoringcriteriaIndex)
                                .get('badgeCount')
                                ?.patchValue(mappedData.commentCount);
                            }
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  private getData() {
    this.templateService
      .getSelectedScoreCardById(
        this.activatedRoute.snapshot.params['scoreCardId']
      )
      .subscribe((data: any) => {
        console.log('scorcard data By Id: ', data);
        this.selectedTemplateData = data;

        if (this.selectedTemplateData) {
          console.log("selected vendor data: ",this.selectedTemplateData);
          
          this.selectedVendor = this.selectedTemplateData.vendorObject;
          this.getVendorList();
          this.populateData(this.selectedTemplateData.scoredTemplateData);
          this.loadView = true;
          this.getCategoryControls().valueChanges.subscribe(console.log);
          this.subscribeOperation();
          this.pullNodeCommentCount(this.selectedTemplateData.templateId);
        }
      });
  }

  private getVendorList() {
    this.proposalService.getVendorList().subscribe((data: any) => {
      console.log(data, 'encrypted data');
      const base64EncodedData = data;
      const decodedData = atob(base64EncodedData);
      console.log(decodedData, 'decode data');
      let toArray = decodedData.split(this.environment.kSeparator);
      const key = CryptoJS.PBKDF2(
        `${this.environment.val1}${this.environment.val2}${this.environment.val3}`,
        CryptoJS.enc.Hex.parse(toArray[1]),
        {
          keySize: this.environment.kSize / 32,
          iterations: this.environment.cIter
        }
      );
      let cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(toArray[2])
      });
      console.log(key, 'key');
      const _iv = toArray[0]
      let cText1 = CryptoJS.AES.decrypt(
        cipherParams,
        key,
        {
          iv: CryptoJS.enc.Hex.parse(_iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      console.log(cText1,'cetext1');
      
      try {
        const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
        const decryptedObject = JSON.parse(decryptedString);
        this.allDecryptedvendorData = decryptedObject
        console.log(this.allDecryptedvendorData, 'decrypted object');
      } catch (error) {
        // console.error('Error parsing decrypted data as JSON:', error);
      }
console.log("allDecryptedvendorData: ",this.allDecryptedvendorData);

      this.vendorList=this.allDecryptedvendorData;
    });
  }

  addCategory(): void {
    let rowCount: any = prompt('How many categories you want to create ?');

    const calculateWeightage = Math.floor(
      100 / ((this.templateForm.get('category') as FormArray).length + rowCount)
    );
    // console.log(calculateWeightage);
    let i = 0;
    while (i < rowCount) {
      (this.templateForm.get('category') as FormArray).push(
        new FormGroup({
          name: new FormControl(''),
          weightage: new FormControl([calculateWeightage]),
          subcategory: new FormArray([
            new FormGroup({
              subcategoryname: new FormControl(''),
              weightage: new FormControl('100.00'),
              subcategoryTwo: new FormArray([
                new FormGroup({
                  subcategoryname: new FormControl(''),
                  weightage: new FormControl('100.00'),
                  subcategoryThree: new FormArray([
                    new FormGroup({
                      subcategoryname: new FormControl(''),
                      weightage: new FormControl('100.00'),
                      parameter: new FormArray([
                        new FormGroup({
                          parametername: new FormControl(''),
                          weightage: new FormControl('100.00'),
                          maxschore: new FormControl(''),
                          schoringcriteria: new FormArray([
                            new FormGroup({
                              criteriaValue: new FormControl(''),
                            }),
                          ]),
                        }),
                      ]),
                    }),
                  ]),
                }),
              ]),
            }),
          ]),
        })
      );

      i++;
    }

    this.calculateWeightage(this.templateForm.get('category') as FormArray);
  }

  removeCategory(index: number): void {
    (this.templateForm.get('category') as FormArray).removeAt(index);
    this.calculateWeightage(this.templateForm.get('category') as FormArray);
  }

  pruposalReport(){
   this.router.navigate(['/ClientUser/report']);
  }


  getProductsData(): void {
    this.templateBuilderService.getProduct().subscribe((response: any) => {
      this.productsData = response;
      this.categories = this.productsData[0].category;
    });
  }

  private subscribeOperation() {
    this.templateBuilderService.dialogFormDataSubscriber$.subscribe(
      (data: any) => {
        // console.log('subscription data: ', data);

        switch (data.action) {
          case 'combine':
            this.combineOperation(data);
            break;
          case 'edit':
            this.subscribeEditOperation(data);
            break;
          case 'search':
            this.subscribeSearchOperation(data);
            break;
        }
      }
    );
  }

  getCategoryControls(): FormArray {
    return this.templateForm.get('category') as FormArray;
  }

  getSubCategoryControls(index: number): FormArray {
    return this.getCategoryControls().at(index).get('subcategory') as FormArray;
  }

  getSubCategoryTwoControls(categoryIndex: number, index: number): FormArray {
    return this.getSubCategoryControls(categoryIndex)
      .at(index)
      .get('subcategoryTwo') as FormArray;
  }

  getSubCategoryThreeControls(
    categoryIndex: number,
    subCategoryIndex: number,
    index: number
  ): FormArray {
    return this.getSubCategoryTwoControls(categoryIndex, subCategoryIndex)
      .at(index)
      .get('subcategoryThree') as FormArray;
  }

  getParameterControls(
    categoryIndex: number,
    subCategoryIndex: number,
    subCategoryTwoIndex: number,
    index: number
  ): FormArray {
    return this.getSubCategoryThreeControls(
      categoryIndex,
      subCategoryIndex,
      subCategoryTwoIndex
    )
      .at(index)
      .get('parameter') as FormArray;
  }

  getScoringCriteriaControls(
    categoryIndex: number,
    subCategoryIndex: number,
    subCategoryTwoIndex: number,
    subCategoryThreeIndex: number,
    index: number
  ): FormArray {
    return this.getParameterControls(
      categoryIndex,
      subCategoryIndex,
      subCategoryTwoIndex,
      subCategoryThreeIndex
    )
      .at(index)
      .get('schoringcriteria') as FormArray;
  }

  populateData(data: any) {
    let controls: any = new FormArray([]);
    data.forEach((categoryControl: any, index: number) => {
      controls.push(
        new FormGroup({
          nodeId: new FormControl({
            value: categoryControl.nodeId,
            disabled: this.disableField,
          }),
          badgeCount: new FormControl(0),
          name: new FormControl({
            value: categoryControl.name,
            disabled: this.disableField,
          }),
          weightage: new FormControl({
            value: categoryControl.weightage,
            disabled: this.disableField,
          }),
          subcategory: this.prepareSubCategoryControl(categoryControl),
        })
      );
    });

    this.templateForm = new FormGroup({ category: controls });
    // console.log('this.templateForm: ', this.templateForm);
  }

  private prepareSubCategoryControl(category: any, data?: any) {
    let categoryControls: any = new FormArray([]);
    category.subcategory.forEach((subcategory: any) => {
      categoryControls.push(
        new FormGroup({
          nodeId: new FormControl({
            value: subcategory.nodeId,
            disabled: this.disableField,
          }),
          badgeCount: new FormControl(0),
          subcategoryname: new FormControl({
            value: subcategory.subcategoryname,
            disabled: this.disableField,
          }),
          weightage: new FormControl({
            value: subcategory.weightage,
            disabled: this.disableField,
          }),
          subcategoryTwo: this.prepareSubCategoryTwoControl(subcategory),
        })
      );
    });
    return categoryControls;
  }

  private prepareSubCategoryTwoControl(subcategory: any, data?: any) {
    let subcategoryTwoControls: any = new FormArray([]);
    subcategory.subcategoryTwo.forEach((subcategoryTwo: any) => {
      subcategoryTwoControls.push(
        new FormGroup({
          nodeId: new FormControl({
            value: subcategoryTwo.nodeId,
            disabled: this.disableField,
          }),
          badgeCount: new FormControl(0),
          subcategoryname: new FormControl({
            value: subcategoryTwo.subcategoryname,
            disabled: this.disableField,
          }),
          weightage: new FormControl({
            value: subcategoryTwo.weightage,
            disabled: this.disableField,
          }),
          subcategoryThree: this.prepareSubCategoryThreeControl(subcategoryTwo),
        })
      );
    });
    return subcategoryTwoControls;
  }

  private prepareSubCategoryThreeControl(subcategoryTwo: any, data?: any) {
    let subcategoryThreeControls: any = new FormArray([]);
    subcategoryTwo.subcategoryThree.forEach((subcategoryThree: any) => {
      // console.log(
      //   'subcategoryThree.subcategoryname: ',
      //   subcategoryThree.subcategoryname
      // );
      subcategoryThreeControls.push(
        new FormGroup({
          nodeId: new FormControl({
            value: subcategoryThree.nodeId,
            disabled: this.disableField,
          }),
          badgeCount: new FormControl(0),
          subcategoryname: new FormControl({
            value: subcategoryThree.subcategoryname,
            disabled: this.disableField,
          }),
          weightage: new FormControl({
            value: subcategoryThree.weightage,
            disabled: this.disableField,
          }),
          parameter: this.prepareParameterControl(subcategoryThree),
        })
      );
    });
    return subcategoryThreeControls;
  }

  private prepareParameterControl(subcategoryThree: any, data?: any) {
    let parameterControls: any = new FormArray([]);
    subcategoryThree.parameter.forEach((parameter: any) => {
      parameterControls.push(
        new FormGroup({
          nodeId: new FormControl({
            value: subcategoryThree.nodeId,
            disabled: this.disableField,
          }),
          badgeCount: new FormControl(0),
          parametername: new FormControl({
            value: parameter.parametername,
            disabled: this.disableField,
          }),
          weightage: new FormControl({
            value: parameter.weightage,
            disabled: this.disableField,
          }),
          maxschore: new FormControl({
            value: parameter.maxschore,
            disabled: this.disableField,
          }),
          score: new FormControl(parameter.score, Validators.required),

          schoringcriteria: this.prepareScoringCriteriaControl(parameter),
        })
      );
    });
    return parameterControls;
  }

  scoringCriteriaColumn: boolean = false;

  private prepareScoringCriteriaControl(parameter: any) {
    let scoringCriteriaControls: any = new FormArray([]);
    if (parameter.schoringcriteria.length === 0) {
      this.scoringCriteriaColumn = true;
    } else {
    parameter.schoringcriteria.forEach((schoringcriteria: any) => {
      scoringCriteriaControls.push(
        new FormGroup({
          nodeId: new FormControl({
            value: schoringcriteria.nodeId,
            disabled: this.disableField,
          }),
          badgeCount: new FormControl(0),
          criteriaValue: new FormControl({
            value: schoringcriteria.criteriaValue,
            disabled: this.disableField,
          }),
          // score: new FormControl(schoringcriteria.score, Validators.required),
        })
      );
    });
  }
    return scoringCriteriaControls;
  }

  onClickBack() {
    this.location.back();
  }

  openViewCommentOverlay(event: Event, nodeId: string, type?: string) {
    // console.log('nodeId: ', nodeId);
    this.issueType = type!;
    this.viewCommentOverlay.toggle(event);

    this.viewComment = false;
    this.commentForm = new FormGroup({
      comment: new FormControl('', Validators.required),
      nodeId: new FormControl(nodeId),
      description: new FormControl('', Validators.required),
    });

    if (this.issueType == 'new') {
      this.viewComment = true;
      this.commentData = {
        userId: this.userId,
        comments: [],
      };
      setTimeout(() => {
        this.commentInput.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 10);
    } else {
      this.getComments(nodeId);
    }
  }

  private getComments(nodeId: string) {
    this.templateService.getNodeComments(nodeId).subscribe((res: any) => {
      // console.log('this.commentData: ', this.commentData);
      this.viewComment = true;
      this.commentData = res;
      setTimeout(() => {
        this.commentInput.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 10);
    });
  }

  getCommentClass(commentByUser: string) {
    if (this.userId.toLowerCase() == commentByUser.toLowerCase()) {
      return 'my-reply';
    } else {
      return 'received-reply';
    }
  }

  postComment(event?: KeyboardEvent, inputEvent: boolean = false) {
    // console.log('event: ', ' inputEvent: ', inputEvent);
    if (
      this.commentForm.get('comment')?.value ||
      (this.issueType = 'new' && this.commentForm.get('description')?.value)
    ) {
      if (inputEvent) {
        if (event?.keyCode == 13) {
          this.sendCommentMessage();
        }
      } else {
        this.sendCommentMessage();
      }
    }
  }

  private sendCommentMessage() {
    if (this.issueType == 'new') {
      this.commentForm.patchValue({
        comment: this.commentForm.get('description')?.value,
      });
    }
    let data: any = {
      nodeId: this.commentForm.get('nodeId')?.value,
      caseStatus: 'Pending',
      issueDate: 0,
      userId: this.commentData.userId,
      templateId: this.selectedTemplateData.templateId,
      comments: [
        {
          commentText: this.commentForm.get('comment')?.value,
          readStatus: true,
          commentDate: 0,
          userId: this.userId,
        },
      ],
    };

    if (this.issueType == 'new') {
      data.issueText = this.commentForm.get('description')?.value;
      data.comments[0].commentText = 'Hey, raised new issue !';
    }

    this.commentForm.patchValue({ comment: '' });
    this.commentData.comments.push(data.comments[0]);
    setTimeout(() => {
      this.commentInput.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 10);

    if (this.issueType == 'new') {
      this.templateService
        .postNodeComment(this.commentForm.get('nodeId')?.value, data)
        .subscribe((res: any) => {
          //this.notificationService.emitDialogFormData("event");

          this.issueType = '';
          this.commentData = data;
          this.populateComments([
            {
              caseStatus: 'Pending',
              commentCount: this.commentData.comments.length,
              nodeId: this.commentForm.get('nodeId')?.value,
            },
          ]);
        });
    } else {
      this.templateService
        .putNodeComment(this.commentForm.get('nodeId')?.value, data)
        .subscribe((res: any) => {
          //this.notificationService.emitDialogFormData("event");

          this.populateComments([
            {
              caseStatus: 'Pending',
              commentCount: this.commentData.comments.length,
              nodeId: this.commentForm.get('nodeId')?.value,
            },
          ]);
        });
    }
  }

  onMarkResolved() {
    let data = {
      nodeId: this.commentForm.get('nodeId')?.value,
      caseStatus: 'Resolved',
      issueDate: 0,
      userId: this.commentData.userId,
      templateId: this.selectedTemplateData.templateId,
      comments: this.commentData.comments,
    };

    this.templateService
      .putNodeStatus(this.commentForm.get('nodeId')?.value, data)
      .subscribe((res: any) => {
        //this.notificationService.emitDialogFormData("event");

        this.getComments(this.commentForm.get('nodeId')?.value);
      });
  }

  getUserCommentBadge(userName: string) {
    return userName.substring(0, 1).toUpperCase();
  }

  setCommentData() {
    this.commentForm
      .get('comment')
      ?.patchValue(this.commentForm.get('description')?.value);
  }

  public onSearchOption(
    operation: string,
    categoryIndex?: number,
    subCategoryIndex?: number,
    subCategoryTwoIndex?: number,
    subCategoryThreeIndex?: number,
    parameterIndex?: number
  ) {
    this.dialog.open(SearchOperationDialogComponent, {
      data: {
        categoriesData: this.categoriesData,
        operation: operation,
        meta: {
          categoryIndex: categoryIndex,
          subCategoryIndex: subCategoryIndex,
          subCategoryTwoIndex: subCategoryTwoIndex,
          subCategoryThreeIndex: subCategoryThreeIndex,
          parameterIndex: parameterIndex,
        },
      },
      height: 'auto',
      minHeight: '100px',
    });
  }

  public onEditOption(
    operation: string,
    categoryIndex?: number,
    subCategoryIndex?: number,
    subCategoryTwoIndex?: number,
    subCategoryThreeIndex?: number,
    parameterIndex?: number
  ) {
    this.dialog.open(EditOperationDialogComponent, {
      data: {
        categoriesData: this.categoriesData,
        operation: operation,
        meta: {
          categoryIndex: categoryIndex,
          subCategoryIndex: subCategoryIndex,
          subCategoryTwoIndex: subCategoryTwoIndex,
          subCategoryThreeIndex: subCategoryThreeIndex,
          parameterIndex: parameterIndex,
        },
      },
      height: 'auto',
      minHeight: '100px',
    });
  }

  initCombine(
    categoryIndex: number,
    operation: string,
    subCategoryIndex?: any,
    subCategoryTwoIndex?: any,
    subCategoryThreeIndex?: any,
    parameterIndex?: any
  ): void {
    let data = this.getCategoryControls().value;
    let newData: any;

    switch (operation) {
      case 'category':
        newData = data.filter((row: any, index: number) => {
          if (row.name != data[categoryIndex].name) {
            return row.name;
          }
        });
        break;
      case 'subCategory':
        newData = this.getDropdownSubCategoryList(
          data[categoryIndex].subcategory[subCategoryIndex].subcategoryname,
          data,
          operation
        );
        break;
      case 'subCategoryTwo':
        newData = this.getDropdownSubCategoryList(
          data[categoryIndex].subcategory[subCategoryIndex].subcategoryTwo[
            subCategoryTwoIndex
          ].subcategoryname,
          data,
          operation
        );
        break;
      case 'subCategoryThree':
        newData = this.getDropdownSubCategoryList(
          data[categoryIndex].subcategory[subCategoryIndex].subcategoryTwo[
            subCategoryTwoIndex
          ].subcategoryThree[subCategoryThreeIndex].subcategoryname,
          data,
          operation
        );
        break;
      case 'parameter':
        newData = this.getDropdownSubCategoryList(
          data[categoryIndex].subcategory[subCategoryIndex].subcategoryTwo[
            subCategoryTwoIndex
          ].subcategoryThree[subCategoryThreeIndex].subcategoryname,
          data,
          'subCategoryThree'
        );
        break;
    }

    this.openDialog({
      newData: newData,
      originalData: data,
      categoryIndex: categoryIndex,
      subCategoryIndex: subCategoryIndex,
      subCategoryTwoIndex: subCategoryTwoIndex,
      subCategoryThreeIndex: subCategoryThreeIndex,
      parameterIndex: parameterIndex,
      operation: operation,
    });
  }

  openDialog(data: any) {
    this.dialog.open(CombineCategoryDialogComponent, {
      data: {
        input: data,
      },
    });
  }

  private getDropdownSubCategoryList(
    value: string,
    data: any,
    operation?: any
  ): void {
    let temp: any = [];
    data.forEach((category: any) => {
      category.subcategory.forEach((subCategory: any) => {
        if (operation == 'subCategory') {
          if (subCategory.subcategoryname != value) {
            // console.log('subCategory: ', subCategory);
            temp.push({ name: subCategory.subcategoryname });
          }
        } else {
          subCategory.subcategoryTwo.forEach((subCategoryTwo: any) => {
            if (operation == 'subCategoryTwo') {
              if (subCategoryTwo.subcategoryname != value) {
                // console.log('subCategoryTwo: ', subCategoryTwo);
                temp.push({ name: subCategoryTwo.subcategoryname });
              }
            } else {
              subCategoryTwo.subcategoryThree.forEach(
                (subCategoryThree: any) => {
                  if (operation == 'subCategoryThree') {
                    if (subCategoryThree.subcategoryname != value) {
                      // console.log('subCategoryThree: ', subCategoryThree);
                      temp.push({ name: subCategoryThree.subcategoryname });
                    }
                  } else {
                    subCategoryThree.parameter.forEach((parameter: any) => {
                      if (operation == 'parameter') {
                        if (parameter.parametername != value) {
                          // console.log('parameter: ', parameter);
                          temp.push({ name: parameter.parametername });
                        }
                      }
                    });
                  }
                }
              );
            }
          });
        }
      });
    });
    return temp;
  }

  addSubCategory(categoryIndex: number): void {
    let rowCount: any = prompt('How many Sub categories you want to create ?');

    let i = 0;
    while (i < rowCount) {
      this.getSubCategoryControls(categoryIndex).push(
        new FormGroup({
          subcategoryname: new FormControl(''),
          weightage: new FormControl('100.00'),
          subcategoryTwo: new FormArray([
            new FormGroup({
              subcategoryname: new FormControl(''),
              weightage: new FormControl('100.00'),
              subcategoryThree: new FormArray([
                new FormGroup({
                  subcategoryname: new FormControl(''),
                  weightage: new FormControl('100.00'),
                  parameter: new FormArray([
                    new FormGroup({
                      parametername: new FormControl(''),
                      weightage: new FormControl('100.00'),
                      maxschore: new FormControl(''),
                      schoringcriteria: new FormArray([
                        new FormGroup({
                          criteriaValue: new FormControl(''),
                        }),
                      ]),
                    }),
                  ]),
                }),
              ]),
            }),
          ]),
        })
      );
      i++;
    }

    this.calculateWeightage(this.getSubCategoryControls(categoryIndex));
  }

  private calculateWeightage(list: FormArray, validation?: boolean): void {
    let newWeightage = (100 / list.length).toFixed(2);

    list.controls.forEach((control: any, index: number) => {
      (control as FormGroup).patchValue({
        weightage: newWeightage,
      });
    });

    this.weightageValidation(list, false, true);
  }

  private weightageValidation(
    list: FormArray,
    validation: boolean = false,
    patchValue: boolean = false
  ): void {
    let totalWeightage: number = 0;

    list.controls.forEach((control: any, index: number) => {
      if (!validation) {
        if (index == list.controls.length - 1 && index > 0) {
          let weightage = control.value.weightage;
          if (patchValue) {
            weightage = (100 - totalWeightage).toFixed(2);
            (control as FormGroup).patchValue({
              weightage: weightage,
            });
          }

          totalWeightage = totalWeightage + Number(weightage);
        } else {
          totalWeightage =
            Number(totalWeightage) + Number(control.value.weightage);
        }
      } else {
        totalWeightage =
          Number(totalWeightage) + Number(control.value.weightage);
      }
    });

    list.controls.forEach((control: any) => {
      if (totalWeightage != 100) {
        (control as FormGroup).setErrors({
          weightageError: true,
        });
      } else {
        (control as FormGroup).setErrors({
          weightageError: false,
        });
      }
    });
  }

  removeSubCategory(categoryIndex: number, index: number): void {
    (
      this.getCategoryControls()
        .at(categoryIndex)
        .get('subcategory') as FormArray
    ).removeAt(index);
    this.calculateWeightage(this.getSubCategoryControls(categoryIndex));
  }
  addSubCategoryTwo(categoryIndex: number, subCategoryIndex: number): void {
    let rowCount: any = prompt('How many Sub categories you want to create ?');

    let i = 0;
    while (i < rowCount) {
      this.getSubCategoryTwoControls(categoryIndex, subCategoryIndex).push(
        new FormGroup({
          subcategoryname: new FormControl(),
          weightage: new FormControl('100.00'),
          subcategoryThree: new FormArray([
            new FormGroup({
              subcategoryname: new FormControl(''),
              weightage: new FormControl('100.00'),
              parameter: new FormArray([
                new FormGroup({
                  parametername: new FormControl(''),
                  weightage: new FormControl('100.00'),
                  maxschore: new FormControl(''),
                  schoringcriteria: new FormArray([
                    new FormGroup({
                      criteriaValue: new FormControl(''),
                    }),
                  ]),
                }),
              ]),
            }),
          ]),
        })
      );
      i++;
    }

    this.calculateWeightage(
      this.getSubCategoryTwoControls(categoryIndex, subCategoryIndex)
    );
  }

  removeSubCategoryTwo(
    categoryIndex: number,
    subCategoryIndex: number,
    index: number
  ): void {
    (
      this.getSubCategoryTwoControls(
        categoryIndex,
        subCategoryIndex
      ) as FormArray
    ).removeAt(index);
    this.calculateWeightage(
      this.getSubCategoryTwoControls(categoryIndex, subCategoryIndex)
    );
  }

  addSubCategoryThree(
    categoryIndex: number,
    subCategoryIndex: number,
    subCategoryTwoIndex: number
  ): void {
    let rowCount: any = prompt('How many Sub categories you want to create ?');

    let i = 0;
    while (i < rowCount) {
      this.getSubCategoryThreeControls(
        categoryIndex,
        subCategoryIndex,
        subCategoryTwoIndex
      ).push(
        new FormGroup({
          subcategoryname: new FormControl(),
          weightage: new FormControl('100.00'),
          parameter: new FormArray([
            new FormGroup({
              parametername: new FormControl(''),
              weightage: new FormControl('100.00'),
              maxschore: new FormControl(''),
              schoringcriteria: new FormArray([
                new FormGroup({
                  criteriaValue: new FormControl(''),
                }),
              ]),
            }),
          ]),
        })
      );
      i++;
    }

    this.calculateWeightage(
      this.getSubCategoryThreeControls(
        categoryIndex,
        subCategoryIndex,
        subCategoryTwoIndex
      )
    );
  }

  removeSubCategoryThree(
    categoryIndex: number,
    subCategoryIndex: number,
    subCategoryTwoIndex: number,
    index: number
  ): void {
    (
      this.getSubCategoryThreeControls(
        categoryIndex,
        subCategoryIndex,
        subCategoryTwoIndex
      ) as FormArray
    ).removeAt(index);
    this.calculateWeightage(
      this.getSubCategoryThreeControls(
        categoryIndex,
        subCategoryIndex,
        subCategoryTwoIndex
      )
    );
  }

  addParameter(
    categoryIndex: number,
    subCategoryIndex: number,
    subCategoryTwoIndex: number,
    subCategoryThreeIndex: number
  ): void {
    let rowCount: any = prompt('How many Parameters you want to create ?');

    let i = 0;
    while (i < rowCount) {
      this.getParameterControls(
        categoryIndex,
        subCategoryIndex,
        subCategoryTwoIndex,
        subCategoryThreeIndex
      ).push(
        new FormGroup({
          parametername: new FormControl(),
          weightage: new FormControl('100.00'),
          maxschore: new FormControl(''),
          schoringcriteria: new FormArray([
            new FormGroup({
              criteriaValue: new FormControl(''),
            }),
          ]),
        })
      );

      i++;
    }

    this.calculateWeightage(
      this.getParameterControls(
        categoryIndex,
        subCategoryIndex,
        subCategoryTwoIndex,
        subCategoryThreeIndex
      )
    );
  }

  removeParameter(
    categoryIndex: number,
    subCategoryIndex: number,
    subCategoryTwoIndex: number,
    subCategoryThreeIndex: number,
    index: number
  ): void {
    this.getParameterControls(
      categoryIndex,
      subCategoryIndex,
      subCategoryTwoIndex,
      subCategoryThreeIndex
    ).removeAt(index);
    this.calculateWeightage(
      this.getParameterControls(
        categoryIndex,
        subCategoryIndex,
        subCategoryTwoIndex,
        subCategoryThreeIndex
      )
    );
  }

  addScoringCriteria(
    categoryIndex: number,
    subCategoryIndex: number,
    subCategoryTwoIndex: number,
    subCategoryThreeIndex: number,
    parameterIndex: number
  ): void {
    let rowCount: any = prompt(
      'How many scoring criteria you want to create ?'
    );

    let i = 0;
    while (i < rowCount) {
      this.getScoringCriteriaControls(
        categoryIndex,
        subCategoryIndex,
        subCategoryTwoIndex,
        subCategoryThreeIndex,
        parameterIndex
      ).push(
        new FormGroup({
          criteriaValue: new FormControl(''),
        })
      );
      i++;
    }
  }

  removeScoringCriteria(
    categoryIndex: number,
    subCategoryIndex: number,
    subCategoryTwoIndex: number,
    subCategoryThreeIndex: number,
    parameterIndex: number,
    index: number
  ): void {
    this.getScoringCriteriaControls(
      categoryIndex,
      subCategoryIndex,
      subCategoryTwoIndex,
      subCategoryThreeIndex,
      parameterIndex
    ).removeAt(index);
  }

  private combineOperation(data: any) {
    switch (data.eventData.operation) {
      case 'category':
        this.combineCategory(data.eventData);
        break;
      case 'subCategory':
        this.combineSubCategory(data.eventData);
        break;
      case 'subCategoryTwo':
        this.combineSubCategoryTwo(data.eventData);
        break;
      case 'subCategoryThree':
        this.combineSubCategoryThree(data.eventData);
        break;
      case 'parameter':
        this.combineParameter(data.eventData);
        break;
    }
  }

  private combineCategory(data: any): void {
    // console.log('combine into index: ', data.categoryIndex);
    this.getSubCategoryControls(data.categoryIndex).value.forEach(
      (subcategory: any, subCategoryIndex: number) => {
        this.getSubCategoryControls(data.selectedIndex).push(
          new FormGroup({
            subcategoryname: new FormControl(subcategory.subcategoryname),
            weightage: new FormControl('100.00'),
            subcategoryTwo: this.prepareSubCategoryTwoControl(subcategory, {
              categoryIndex: data.categoryIndex,
              subCategoryIndex: subCategoryIndex,
            }),
          })
        );

        this.calculateWeightage(
          this.getSubCategoryControls(data.selectedIndex)
        );
      }
    );

    this.removeCategory(data.categoryIndex);
    this.dialog.closeAll();
  }

  private combineSubCategory(data: any): void {
    // console.log('combine into index: ', data.categoryIndex);
    this.getSubCategoryTwoControls(
      data.categoryIndex,
      data.subCategoryIndex
    ).value.forEach((subcategoryTwo: any, subcategoryTwoIndex: number) => {
      this.getSubCategoryTwoControls(
        data.selectedCategoryIndex,
        data.selectedIndex
      ).push(
        new FormGroup({
          subcategoryname: new FormControl(subcategoryTwo.subcategoryname),
          weightage: new FormControl('100.00'),
          subcategoryThree: this.prepareSubCategoryThreeControl(
            subcategoryTwo,
            {
              categoryIndex: data.categoryIndex,
              subcategoryTwoIndex: subcategoryTwoIndex,
            }
          ),
        })
      );

      this.calculateWeightage(
        this.getSubCategoryTwoControls(
          data.selectedCategoryIndex,
          data.selectedIndex
        )
      );
    });

    this.removeSubCategory(data.categoryIndex, data.subCategoryIndex);
    this.dialog.closeAll();
  }

  private combineSubCategoryTwo(data: any): void {
    // console.log('combine into index: ', data.categoryIndex);
    this.getSubCategoryThreeControls(
      data.categoryIndex,
      data.subCategoryIndex,
      data.subCategoryTwoIndex
    ).value.forEach((subcategoryThree: any, subcategoryThreeIndex: number) => {
      this.getSubCategoryThreeControls(
        data.selectedCategoryIndex,
        data.selectedSubCategoryIndex,
        data.selectedIndex
      ).push(
        new FormGroup({
          subcategoryname: new FormControl(subcategoryThree.subcategoryname),
          weightage: new FormControl('100.00'),
          parameter: this.prepareParameterControl(subcategoryThree, {
            categoryIndex: data.categoryIndex,
          }),
        })
      );

      this.calculateWeightage(
        this.getSubCategoryThreeControls(
          data.selectedCategoryIndex,
          data.selectedSubCategoryIndex,
          data.selectedIndex
        )
      );
    });

    this.removeSubCategoryTwo(
      data.categoryIndex,
      data.subCategoryIndex,
      data.subCategoryTwoIndex
    );
    this.dialog.closeAll();
  }

  private combineSubCategoryThree(data: any): void {
    // console.log('combine into index: ', data.categoryIndex);
    this.getParameterControls(
      data.categoryIndex,
      data.subCategoryIndex,
      data.subCategoryTwoIndex,
      data.subCategoryThreeIndex
    ).value.forEach((parameter: any, parameterIndex: number) => {
      this.getParameterControls(
        data.selectedCategoryIndex,
        data.selectedSubCategoryIndex,
        data.selectedSubCategoryTwoIndex,
        data.selectedIndex
      ).push(
        new FormGroup({
          parametername: new FormControl(parameter.parametername),
          weightage: new FormControl('100.00'),
          maxschore: new FormControl(parameter.maxschore),
          schoringcriteria: this.prepareScoringCriteriaControl(parameter),
        })
      );
    });

    this.calculateWeightage(
      this.getParameterControls(
        data.selectedCategoryIndex,
        data.selectedSubCategoryIndex,
        data.selectedSubCategoryTwoIndex,
        data.selectedIndex
      )
    );

    this.removeSubCategoryThree(
      data.categoryIndex,
      data.subCategoryIndex,
      data.subCategoryTwoIndex,
      data.subCategoryThreeIndex
    );
    this.dialog.closeAll();
  }

  private combineParameter(data: any): void {
    let parameterControl = this.getParameterControls(
      data.categoryIndex,
      data.subCategoryIndex,
      data.subCategoryTwoIndex,
      data.subCategoryThreeIndex
    ).at(data.parameterIndex);

    this.getParameterControls(
      data.selectedCategoryIndex,
      data.selectedSubCategoryIndex,
      data.selectedSubCategoryTwoIndex,
      data.selectedSubCategoryThreeIndex
    ).push(
      new FormGroup({
        parametername: new FormControl(parameterControl.value.parametername),
        weightage: new FormControl('100.00'),
        maxschore: new FormControl(parameterControl.value.maxschore),
        schoringcriteria: this.prepareScoringCriteriaControl(
          parameterControl.value
        ),
      })
    );

    this.calculateWeightage(
      this.getParameterControls(
        data.selectedCategoryIndex,
        data.selectedSubCategoryIndex,
        data.selectedSubCategoryTwoIndex,
        data.selectedIndex
      )
    );

    this.removeParameter(
      data.categoryIndex,
      data.subCategoryIndex,
      data.subCategoryTwoIndex,
      data.subCategoryThreeIndex,
      data.parameterIndex
    );
    this.dialog.closeAll();
  }

  public createCategoryCopy(index: number) {
    let categoryControl = this.getCategoryControls().at(index).value;

    (this.templateForm.get('category') as FormArray).push(
      new FormGroup({
        name: new FormControl(categoryControl.name),
        weightage: new FormControl(categoryControl.weightage),
        subcategory: this.prepareSubCategoryControl(categoryControl),
      })
    );

    this.calculateWeightage(this.getCategoryControls());
  }

  private subscribeEditOperation(data: any) {
    // console.log('Edit subscription data: ', data);
    this.patchValue(data);
    this.dialog.closeAll();
  }

  private subscribeSearchOperation(data: any) {
    // console.log('Search subscription data: ', data);
    this.patchValue(data);
    this.dialog.closeAll();
  }

  private patchValue(data: any) {
    switch (data.operation) {
      case 'category':
        this.getCategoryControls()
          .at(data.meta.categoryIndex)
          .get('name')
          ?.patchValue(data.fieldValue);
        break;
      case 'subCategory':
        this.getSubCategoryControls(data.meta.categoryIndex)
          .at(data.meta.subCategoryIndex)
          .get('subcategoryname')
          ?.patchValue(data.fieldValue);
        break;
      case 'subCategoryTwo':
        this.getSubCategoryTwoControls(
          data.meta.categoryIndex,
          data.meta.subCategoryIndex
        )
          .at(data.meta.subCategoryTwoIndex)
          .get('subcategoryname')
          ?.patchValue(data.fieldValue);
        break;
      case 'subCategoryThree':
        this.getSubCategoryThreeControls(
          data.meta.categoryIndex,
          data.meta.subCategoryIndex,
          data.meta.subCategoryTwoIndex
        )
          .at(data.meta.subCategoryThreeIndex)
          .get('subcategoryname')
          ?.patchValue(data.fieldValue);
        break;
      case 'parameter':
        this.getParameterControls(
          data.meta.categoryIndex,
          data.meta.subCategoryIndex,
          data.meta.subCategoryTwoIndex,
          data.meta.subCategoryThreeIndex
        )
          .at(data.meta.parameterIndex)
          .get('parametername')
          ?.patchValue(data.fieldValue);
        break;
    }
  }

  onClickApprove() {
    let data = {
      scoreCardId: parseInt(this.activatedRoute.snapshot.params['scoreCardId']),
      vendorId: this.selectedVendor.vendorId,
      userId: this.userId,
      vendorObject: this.selectedVendor,
      projectData: this.selectedTemplateData.projectData,
      templateId: this.selectedTemplateData.templateId,
      projectId: this.selectedTemplateData.projectId,
      templateDescription: this.selectedTemplateData.templateDescription,
      editedBy:this.selectedTemplateData.editedBy,
      editedOn:this.selectedTemplateData.editedOn,
      status: 'Done',
      scoredTemplateData: JSON.stringify(this.templateForm.value.category),
    };

    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Proposal approved successfully',
    });
    console.log('data: ', data);
    this.proposalService
      .updateScorcard(this.selectedTemplateData.scoreCardId, data)
      .subscribe((result: any) => {
        ////this.notificationService.emitDialogFormData("event");

        // console.log(result, 'Proposal approved.');
        this.router.navigate(['/ClientUser/score-cards']);
      });
  }

  onClickCancel() {
    this.router.navigate(['/ClientUser/score-cards']);
  }

  onClickViewProposal() {
    this.projectService
      .getDocDataBYScoredcardId(
        this.activatedRoute.snapshot.params['scoreCardId']
      )
      .subscribe((data1: any) => {
        let id = data1.docName;
        console.log(data1);

        this.projectService.downloadFile(data1.docKey).subscribe(
          (x: any) => {
            // console.log(x,"..!!");

            var newBlob = new Blob([x], { type: 'application/pdf' });

            const data1 = window.URL.createObjectURL(newBlob);

            var link = document.createElement('a');
            link.href = data1;
            link.download = id;
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(
              new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
              })
            );

            // saveAs(data, id);
            // console.log('file downloaded');
            this.messageService.add({
              severity: 'success',
              summary: 'Download complete',
              detail: "File has been downloaded and store in 'Downloads' ",
            });
          },

          (error: HttpErrorResponse) => {
            alert(error);
          }
        );
      });
  }

  downloadRfp() {
    this.projectService
      .getDocDataBYProjectId(this.selectedTemplateData.projectId)
      .subscribe(
        (data1: any) => {
          // console.log(data1, ' doc data by peoject id');
          let id = data1.docName;

          this.projectService.downloadFile(data1.docKey).subscribe(
            (x: any) => {
              // console.log(x,"..!!");

              var newBlob = new Blob([x], { type: 'application/pdf' });

              const data1 = window.URL.createObjectURL(newBlob);

              var link = document.createElement('a');
              link.href = data1;
              link.download = id;
              // this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(
                new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );

              // saveAs(data, id);
              // console.log('file downloaded');
              this.messageService.add({
                severity: 'success',
                summary: 'Download complete',
                detail: "File has been downloaded and store in 'Downloads' ",
              });
            },
            (error: HttpErrorResponse) => {
              alert(error);
            }
          );
        },
        (error: HttpErrorResponse) => {}
      );
  }
}
