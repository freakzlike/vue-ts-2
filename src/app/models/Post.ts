import {ServiceModel} from '@/models/ServiceModel'
import {CharField, UUIDField} from '@/models/Field'

class Post extends ServiceModel {
  static keyName = 'AppPost'

  static urls = {
    BASE: 'https://jsonplaceholder.typicode.com/posts/'
  }

  static cacheDuration = 5

  static fieldsDef = {
    id: new UUIDField(),
    title: new CharField({label: 'Title'}),
    body: new CharField({label: 'Body'})
  }
}

export default Post
export {Post}
