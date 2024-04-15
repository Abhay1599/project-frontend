import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../core/auth.service";
import { Table, TableLazyLoadEvent } from "primeng/table";

// Define the interface for the request body used in the API call.
interface RequestBody {
  first: number; // Offset index of the first row to be fetched
  rows: number; // Number of rows to fetch
  filter?: {
    // Optional filter object
    title: string; // Filter by movie title
  };
}
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  // Inject AuthService to interact with authentication and data retrieval.
  constructor(private _service: AuthService) {}

  // Initialize component properties.
  movies: any[] = []; // Array to store movies
  totalRecords: any; // Store the total number of records available
  request: RequestBody = {
    // Default request parameters for movie data
    first: 0,
    rows: 10,
    filter: {
      title: "",
    },
  };
  loading: boolean = false; // Flag to track data loading state
  globalFilter = ""; // Variable to hold global filter for movie titles

  // Component initialization lifecycle hook.
  ngOnInit(): void {
    this.getMovies();
  }

  // Load movies based on lazy loading event data from a PrimeNG table.
  loadMovies($event: TableLazyLoadEvent) {
    this.request.first = $event.first || 0; // Set the starting row index
    this.request.rows = $event.rows || 10; // Set the number of rows to fetch
    this.getMovies(); // Fetch movies
  }

  // Clear filters and sorting state of a table.
  clear(table: Table) {
    table.clear();
  }

  // Fetch movies from the backend using the current request parameters.
  getMovies() {
    this.loading = true; // Set loading state to true
    this._service.getMovies(this.request).subscribe({
      next: (res) => {
        this.movies = res.movies; // Assign the movies from the response
        this.totalRecords = res.totalRecords; // Update the total records count
      },
      error: (e) => console.error(e), // Log any errors
      complete: () => {
        this.loading = false; // Reset loading state on completion
      },
    });
  }

  // Filter movies based on the title entered in the global filter.
  filterMoviesByTitle() {
    this.request = {
      ...this.request,
      first: 0, // Reset pagination to the first page
      filter: {
        title: this.globalFilter, // Set filter title to global filter
      },
    };
    this.getMovies(); // Fetch filtered movies
  }
}
