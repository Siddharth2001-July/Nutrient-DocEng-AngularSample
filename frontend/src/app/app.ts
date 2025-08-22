import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';
import { PdfViewer } from './pdf-viewer/pdf-viewer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, PdfViewer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  serverStatus = signal('');
  apiData = signal('');
  jwtToken = signal('');

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.testConnection();
  }

  testConnection() {
    this.apiService.getServerStatus().subscribe({
      next: (response) => {
        this.serverStatus.set(response.message);
      },
      error: (error) => {
        this.serverStatus.set('Error connecting to backend');
        console.error('Error:', error);
      }
    });

    this.apiService.getData().subscribe({
      next: (response) => {
        this.apiData.set(JSON.stringify(response));
      },
      error: (error) => {
        this.apiData.set('Error fetching data');
        console.error('Error:', error);
      }
    });
  }

  generateJWT() {
    const documentId = 'sample-document-123';
    this.apiService.getNutrientJWT(documentId).subscribe({
      next: (response) => {
        this.jwtToken.set(response.jwt);
        console.log('Generated JWT:', response.jwt);
      },
      error: (error) => {
        this.jwtToken.set('Error generating JWT');
        console.error('JWT Error:', error);
      }
    });
  }
}
