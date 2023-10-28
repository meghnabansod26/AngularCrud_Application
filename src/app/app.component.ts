import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { APIService } from './services/api.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Assign2';
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'FirstName',
    'LastName',
    'Gender',
    'skills',
    'date',
    'Role',
    'AboutEmployee',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  getSkillsList(skills: any): string {
    const skillNames = Object.keys(skills).filter((key) => skills[key]);
    return skillNames.join(', ');
  }

  constructor(private dialog: MatDialog, private API: APIService,
    private toastr : ToastrService
   
    ) {}

  ngOnInit(): void {
    this.getAllRegisters();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '40%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Register') {
          this.getAllRegisters();
        }
      });
  }

  getAllRegisters() {
    this.API.getRegister().subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator!;
        this.dataSource.sort = this.sort!;
      },
      error: (err) => {
        this.toastr.warning("Error while fetching the Register")
      },
    });
  }

  deleteRegister(id: number) {
    this.API.deleteRegister(id).subscribe({
      next: (res) => {
        this.toastr.success("Employee Details Deleted Successfully");
        this.getAllRegisters();
      },
      error: () => {
        this.toastr.warning("Error while deleting the Employee Details");


      },
    });
  }

  editemployee(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '40%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'edit') {
          this.getAllRegisters();
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
