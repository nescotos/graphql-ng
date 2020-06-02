import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm }  from '@angular/forms';
import {  Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

type User = {
  id: number,
  name: string,
  username: string
}

type Post = {
  id: number,
  title: string,
  description: string,
  user: User
}

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

const CreatePost = gql`
  mutation PostMutation($input: CreatePostInput!){
    createPost(createPostInput: $input){
      title
      description
      id
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
  posts: Post[];

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    this.queryPost = this.apollo.watchQuery<any>({
      query: GetPost
    })
    .valueChanges
    .subscribe(({data, loading}) => {
      this.loading = loading;
      this.posts = data.getPosts;
    });
  }

  ngOnDestroy(){
    this.queryPost.unsubscribe();
  }

  onSubmit(f: NgForm){
    console.log(f.value);
    this.apollo.mutate({
      mutation: CreatePost,
      variables: {
        input : {
          title: f.value['title'],
          description: f.value['description'],
          userId: 1
        }
      }
    })
    .subscribe(({data}) => {
      this.posts.unshift(data['createPost']);
    }, (error: Error) => {
      console.error(error.message);
    });

  }

}
