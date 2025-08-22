import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import NutrientViewer from '@nutrient-sdk/viewer';

@Component({
  selector: 'app-pdf-viewer',
  imports: [],
  templateUrl: './pdf-viewer.html',
  styleUrl: './pdf-viewer.css'
})
export class PdfViewer implements OnInit {
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const documentId = "7KPS5Z5AFAJ121K54KSR2FZM0A";
    
    this.apiService.getNutrientJWT(documentId).subscribe({
      next: (response) => {
        NutrientViewer.load({
          serverUrl: "http://localhost:5000/",
          baseUrl: `${location.protocol}//${location.host}/assets/`,
          documentId: documentId,
          container: "#nutrient-container",
          authPayload: { jwt: response.jwt },
          instant: false,
          toolbarItems: [...NutrientViewer.defaultToolbarItems, { type: 'comment' }],
        }).then(instance => {
          (window as any).instance = instance;
        });
      },
      error: (error) => {
        console.error('JWT Error:', error);
      }
    });
  }
}
