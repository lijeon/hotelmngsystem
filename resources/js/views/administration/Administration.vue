<template>
    <div class="body">
        

        <div class="sidebar">
            <sidebar/> 
        </div>

        <div class="content">

            <div class="header-main">
                <pHeader></pHeader>
            </div>
          

            <div class="main-content">
                <router-view></router-view>
            </div>
           
        </div>

   
    </div>
</template>

<script>
import pHeader from '../../components/pHeader.vue'
import Sidebar from '../../components/Sidebar.vue'
    export default {
    components: { Sidebar, pHeader },
        name: 'Administration',
        data(){
            return {
        
            }
        },
     
        
    }
</script>

<style lang="scss" scoped>
.body {
    height: 100vh;
    background-color: #f5f5f5 ;
    // position: absolute;
    width: 100%;
    flex: 1;
    padding: 0;
    display: flex;


    .content {
        background-color: white;
        flex: 4.5;
        margin: 20px;
        // margin-left: 0;
        border-radius: 10px;
        // overflow-y: scroll;


        .header-main {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .main-content {
            height: 800px;
            overflow-y: scroll;
        }

    }
}
</style>
