import {defineComponent} from 'vue';
const NAME = 'fcUpload';

import {parseFile,parseUpload} from '@form-create/utils/lib/file'

export default defineComponent({
    name: NAME,
    inheritAttrs: false,
    props: {
        formCreateInject: Object,
        action:String,
        limit: {
            type: Number,
            default: 0
        },
        modelValue: {
            type: Array,
            default: []
        },
        onSuccess: {
            type: Function,
        },
        onRemove: {
            type: Function,
        },
    },
    data(){
        return {
            uploadList:[]
        }
    },
    watch: {
        modelValue(n) {
            this.uploadList = n.map(parseFile).map(parseUpload)
        }
    },
    methods:{
        handleRemove({file,index}){
            this.uploadList.splice(index,1)
            this.onRemove && this.onRemove(file,this.uploadList)
            this.input()
        },
        handleSuccess({file, fileList}){
            this.uploadList = fileList;
            const {onSuccess} = this
            if(file.status === 'success'){
                onSuccess && onSuccess(file,this.uploadList)
            }
            this.input()
            this.$emit('change', ...arguments);
        },
        input(){
            this.$emit('update:modelValue', this.uploadList.map(v => v.url));
        }
    },
    render() {
        return <>
            <t-upload
                action={this.action}
                theme={this.theme || 'image'}
                accept={this.accept || 'image/*'}
                multiple={this.multiple}
                max={this.limit}
                modelValue={this.uploadList}
                onSuccess={this.handleSuccess}
                onRemove={this.handleRemove}
                v-slots={this.$slots}
            >
            </t-upload>
        </>
    }
});
