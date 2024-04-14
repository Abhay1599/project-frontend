import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  
  readonly APIurl="http://localhost:8000/";


  constructor(private http: HttpClient) {
    // constructor logic here
  }
  message:any=[];
  movies: any[] = [];

  getMessage(){
    this.http.get(this.APIurl).subscribe((data)=>{
      this.message=data;
    })
  }
  // ngOnInit() {
  //   this.getMessage();
  // }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.http.get<any[]>('http://localhost:8000/allMovies').subscribe(
      (data) => {
        this.movies = data;
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }
}

