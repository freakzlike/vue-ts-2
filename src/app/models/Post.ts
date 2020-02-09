import {ServiceModel, TServiceParent} from '@/models/ServiceModel'
import {CharField, UUIDField} from '@/models/Field'

class Post extends ServiceModel {
  static keyName = 'AppPost'

  static urls = {
    BASE: 'https://jsonplaceholder.typicode.com/posts/'
  }

  static fieldsDef = {
    id: new UUIDField(),
    title: new CharField({label: 'Title'}),
    body: new CharField({label: 'Body'})
  }
}

Post.register()

export default Post
export {Post}
