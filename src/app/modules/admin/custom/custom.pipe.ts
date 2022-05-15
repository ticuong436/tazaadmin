import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'findbyid'})
export class FindbyidPipe implements PipeTransform {
  transform(id:any,items: any,result:any): any { 
    let data = items.find(v=>v.id == id);
    if(data)
    {
      return items.find(v=>v.id == id)[result];
    }
   
  }
}
