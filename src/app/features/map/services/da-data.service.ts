import { inject, Injectable } from '@angular/core';
import { DA_DATA_API_KEY } from '@core/tokens.provider';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface IDaDataRequest {
  query: string;
  count?: number;
}

export interface IDaDataResponse {
  suggestions: IDaDataSuggestion[];
}

export interface IDaDataSuggestion {
  unrestricted_value: string;
  value: string;
  data: IDaDataSuggestionData;
}

export interface IDaDataSuggestionData {
  geo_lat: string;
  geo_lon: string;
  city_type_full: string;
  city: string;
  street_type: string;
}

const URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

@Injectable({
  providedIn: 'root'
})
export class DaDataService {
  apiKey = inject(DA_DATA_API_KEY);
  httpClient = inject(HttpClient);

  request(body: IDaDataRequest): Observable<IDaDataResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Token ${ this.apiKey }`,
    })

    return this.httpClient.post<IDaDataResponse>(URL, body, {
      headers: headers,
    });
  }

  requestCities(body: IDaDataRequest) {
    const data = this.request(body);

    return data.pipe(
      map((res: IDaDataResponse) => {
        return res.suggestions.filter((item) => !!item.data.city && !item.data.street_type);
      })
    )
  }
}
