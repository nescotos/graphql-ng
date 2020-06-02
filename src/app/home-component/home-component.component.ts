import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {  Apollo } from 'apollo-angular';
import gql from 'graphql-tag';


const GetPost = gql`
  query GetPost{
    getPosts{
      id
      description
      title
      user{
        username
      }
    }
  }
`;

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})

export class HomeComponentComponent implements OnInit, OnDestroy {

  private queryPost: Subscription;

  loading: boolean;
  posts: any;

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    this.queryPost = this.apollo.watchQuery<any>({
      query: GetPost
    })
    .valueChanges
    .subscribe(({data, loading}) => {
      this.loading = loading;
      this.posts = data;
    });
  }

  ngOnDestroy(){
    this.queryPost.unsubscribe();
  }

}
