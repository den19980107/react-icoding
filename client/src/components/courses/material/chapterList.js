import React, { Component } from 'react';
import ChapterListItem from './chapterListItem';
class chapterList extends Component {
   constructor(props) {
      super(props)
      this.state = {
         chapters: this.props.chapters
      }
   }

   render() {
      if (this.props.chapters) {
         return (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "start" }}>
               {this.props.chapters.map(chapter => (
                  <ChapterListItem key={chapter._id} chapter={chapter} reflashChapter={this.props.reflashChapter}></ChapterListItem>
               ))}
            </div>
         );
      } else {
         return (
            <div>沒有資料</div>
         )
      }
   }
}

export default chapterList;