import {ServiceModel} from '@/models/ServiceModel'
import {CharField, UUIDField} from '@/models/Field'

class Comment extends ServiceModel {
  static keyName = 'AppComment'
  static parents = ['post']

  static fieldsDef = {
    id: new UUIDField(),
    name: new CharField({label: 'Name'}),
    email: new CharField({label: 'Email'}),
    body: new CharField({label: 'Body'})
  }
}

Comment.register()

export default Comment
export {Comment}
