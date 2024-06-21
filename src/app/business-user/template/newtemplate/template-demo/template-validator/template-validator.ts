import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class TemplateValidations {
  public RunValidation(): ValidatorFn {
    return (control: AbstractControl) => {
      this.validateCategory(control);
      return null;
    };
  }

  private validateCategoryControls(control: any) {
    const categoryControl = control.get('category') as FormArray;
    console.log('categoryControl: ', categoryControl.length);

    const initialCategoryValue = categoryControl?.value[0].name;
    console.log('initialCategoryValue: ', initialCategoryValue);

    categoryControl.value?.forEach((category: any, index: number) => {
      console.log('category value: ', category.name);
      if (index > 0) {
        if (initialCategoryValue == category.name) {
          console.log('Error at category index: ', index);
          categoryControl.at(index).setErrors({ categoryError: true });
          return;
        } else {
          return this.validateSubCategoryControls(
            categoryControl,
            control,
            index
          );
        }
      }
    });
  }

  private validateSubCategoryControls(
    categoryControl: any,
    control: any,
    index: number
  ) {
    let initialSubCategoryValue =
      control?.value['category'][0]['subcategory'][0].subcategoryname;
    console.log('initialSubCategoryValue: ', initialSubCategoryValue);

    control?.value['category'][index]['subcategory'].forEach(
      (subCategory: any, subCategoryIndex: number) => {
        console.log('subcategoryname value: ', subCategory.subcategoryname);
        if (initialSubCategoryValue == subCategory.subcategoryname) {
          console.log('Error at subCategory index: ', subCategoryIndex);
          (categoryControl?.at(index)?.get('subcategory') as FormArray)
            .at(subCategoryIndex)
            .setErrors({ subCategoryError: true });
          return;
        } else {
          return this.validateParameterControls(
            categoryControl,
            control,
            index,
            subCategoryIndex
          );
        }
      }
    );
  }

  private validateSubCategoryTwoControls(
    categoryControl: any,
    control: any,
    index: number
  ) {
    let initialSubCategoryValue =
      control?.value['category'][0]['subcategory'][0].subcategoryname;
    console.log('initialSubCategoryValue: ', initialSubCategoryValue);

    control?.value['category'][index]['subcategory'].forEach(
      (subCategory: any, subCategoryIndex: number) => {
        console.log('subcategoryname value: ', subCategory.subcategoryname);
        if (initialSubCategoryValue == subCategory.subcategoryname) {
          console.log('Error at subCategory index: ', subCategoryIndex);
          (categoryControl?.at(index)?.get('subcategory') as FormArray)
            .at(subCategoryIndex)
            .setErrors({ subCategoryError: true });
          return;
        } else {
          return this.validateParameterControls(
            categoryControl,
            control,
            index,
            subCategoryIndex
          );
        }
      }
    );
  }

  private validateSubCategoryThreeControls(
    categoryControl: any,
    control: any,
    index: number
  ) {
    let initialSubCategoryValue =
      control?.value['category'][0]['subcategory'][0].subcategoryname;
    console.log('initialSubCategoryValue: ', initialSubCategoryValue);

    control?.value['category'][index]['subcategory'].forEach(
      (subCategory: any, subCategoryIndex: number) => {
        console.log('subcategoryname value: ', subCategory.subcategoryname);
        if (initialSubCategoryValue == subCategory.subcategoryname) {
          console.log('Error at subCategory index: ', subCategoryIndex);
          (categoryControl?.at(index)?.get('subcategory') as FormArray)
            .at(subCategoryIndex)
            .setErrors({ subCategoryError: true });
          return;
        } else {
          return this.validateParameterControls(
            categoryControl,
            control,
            index,
            subCategoryIndex
          );
        }
      }
    );
  }

  private validateParameterControls(
    categoryControl: any,
    control: any,
    index: number,
    subCategoryIndex: number
  ) {
    let initialParameterValue =
      control?.value['category'][0]['subcategory'][0]['parameter'][0]
        .parametername;
    console.log('initialParameterValue: ', initialParameterValue);
    control?.value['category'][index]['subcategory'][subCategoryIndex][
      'parameter'
    ].forEach((parameter: any, parameterIndex: number) => {
      console.log('parametername value: ', parameter.parametername);

      if (initialParameterValue == parameter.parametername) {
        console.log('Error at parameter index: ', parameterIndex);
        (
          (categoryControl?.at(index)?.get('subcategory') as FormArray)
            .at(subCategoryIndex)
            .get('parameter') as FormArray
        )
          .at(parameterIndex)
          .setErrors({ parameterError: true });
        return;
      }
    });
  }

  private validateCategory(control: any) {
    console.log('parent category data without from control: ', control);

    const categoryControl = control.get('category') as FormArray;
    categoryControl.value.find((row: any, rowIindex: number) => {
      var selfObj = this;
      // selfObj.validateSubCategoryControlsCopy(
      //   control.get('category').at(rowIindex) as FormArray
      // );
      categoryControl.value.find((data: any, i: number) => {
        if (data.name === row.name && rowIindex !== i) {
          categoryControl.at(rowIindex).setErrors({ categoryError: true });
          categoryControl.at(rowIindex+1).setErrors({categoryControl:true});
          console.log(categoryControl);
        } else {
          if(data.name === row.name && rowIindex !== i){
            categoryControl.at(rowIindex).setErrors({ categoryError: true });
          }
          categoryControl.at(rowIindex).setErrors({ categoryError: false });

          // const innerSubCategoryControl = control
          //   .get('category')
          //   .at(rowIindex) as FormArray;
          // console.log('innerSubCategoryControl: ', innerSubCategoryControl);

          // innerSubCategoryControl.value.subcategory.find(
          //   (row: any, rowIindex: number) => {
          //     var selfObj = this;

          //     if (innerSubCategoryControl.value.subcategory.length > 0) {
          //       innerSubCategoryControl.value.subcategory.find(
          //         (data1: any, i: number) => {
          //           if (
          //             data1.subcategoryname === data.name

          //           ) {

          //               categoryControl.at(rowIindex).setErrors({ categoryError: true });

          //           } else {
          //               // categoryControl.at(rowIindex).setErrors({ categoryError: false });

          //           }
          //         }
          //       );
          //     }
          //   }
          // );

          // categoryControl.at(rowIindex).setErrors({ categoryError: false });
        }
      });
    });
  }

  validateSubCategoryControlsCopy(categoryControl: any) {
    console.log('categoryControl data: ', categoryControl);

    categoryControl.value.subcategory.find((row: any, rowIindex: number) => {
      var selfObj = this;

      if (categoryControl.value.subcategory.length > 0) {
        categoryControl.value.subcategory.find((data: any, i: number) => {
          if (data.subcategoryname === row.subcategoryname && rowIindex !== i) {
            categoryControl
              .get('subcategory')
              .at(rowIindex)
              .setErrors({ subCategoryError: true });
            // return;
          } else {
            categoryControl
              .get('subcategory')
              .at(rowIindex)
              .setErrors({ subCategoryError: false });
          }
        });
      }
      selfObj.validateSubCategoryTowControlsCopy(
        categoryControl.get('subcategory').at(rowIindex)
      );
    });
  }

  validateSubCategoryTowControlsCopy(subcategoryControl: any) {
    console.log('subcategory control: ', subcategoryControl);
    subcategoryControl.value.subcategoryTwo.find(
      (row: any, rowIindex: number) => {
        var selfObj = this;
        selfObj.validateSubCategoryThreeControlsCopy(
          subcategoryControl.get('subcategoryTwo').at(rowIindex)
        );

        if (subcategoryControl.value.subcategoryTwo.length > 0) {
          subcategoryControl.value.subcategoryTwo.find(
            (data: any, i: number) => {
              console.log(data);

              if (
                data.subcategoryname === row.subcategoryname &&
                rowIindex !== i
              ) {
                subcategoryControl
                  .get('subcategoryTwo')
                  .at(rowIindex)
                  .setErrors({ subcategoryTwoError: true });
                // return;
              } else {
                subcategoryControl
                  .get('subcategoryTwo')
                  .at(rowIindex)
                  .setErrors({ subcategoryTwoError: false });
              }
            }
          );
        }
      }
    );
  }
  validateSubCategoryThreeControlsCopy(subcategoryTwoControl: any) {
    console.log('subcategory control: ', subcategoryTwoControl);
    subcategoryTwoControl.value.subcategoryThree.find(
      (row: any, rowIindex: number) => {
        var selfObj = this;
        selfObj.parameterValidation(
          subcategoryTwoControl.get('subcategoryThree').at(rowIindex)
        );

        if (subcategoryTwoControl.value.subcategoryThree.length > 0) {
          subcategoryTwoControl.value.subcategoryThree.find(
            (data: any, i: number) => {
              console.log(data);

              if (
                data.subcategoryname === row.subcategoryname &&
                rowIindex !== i
              ) {
                subcategoryTwoControl
                  .get('subcategoryThree')
                  .at(rowIindex)
                  .setErrors({ getSubCategoryThreeError: true });
                // return;
              } else {
                subcategoryTwoControl
                  .get('subcategoryThree')
                  .at(rowIindex)
                  .setErrors({ getSubCategoryThreeError: false });
              }
            }
          );
        }
      }
    );
  }
  parameterValidation(parameterControl: any) {
    console.log('subcategory control: ', parameterControl);
    parameterControl.value.parameter.find((row: any, rowIindex: number) => {
      if (parameterControl.value.parameter.length > 0) {
        parameterControl.value.parameter.find((data: any, i: number) => {
          console.log(data);

          if (data.parametername === row.parametername && rowIindex !== i) {
            parameterControl
              .get('parameter')
              .at(rowIindex)
              .setErrors({ parameterError: true });
            // return;
          } else {
            parameterControl
              .get('parameter')
              .at(rowIindex)
              .setErrors({ parameterError: false });
          }
        });
      }
    });
  }
}
