import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
import notRegistered from '../preSignUpList/notRegistered'
import registered from '../preSignUpList/registered'
export default{
  components: { tableBar, returnBtn, registered, notRegistered },
  data () {
    return {
      page: 'notRegistered'
    }
  },
  mounted () {
  },
  methods: {
  }
}
