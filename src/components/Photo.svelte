<script>
    import DataStore from '../stores/DataStore.js';
    import { onDestroy } from 'svelte';

    export let id;
    let image = null;
    let level = 0;
    const unsubscribe = DataStore.subscribe(value => {
		for(let entry of value["photos"]){
            if(entry["id"] == id){
                image = entry;
                break;
            }
        }
	});
    onDestroy(unsubscribe);
    
    function setLevel(){
        if(level == 0)level = 1;
        else level = 0;
    }
</script>

<div id="photo">
    {#if image != null}
        <img src="{image.photourl}" alt="" class:level1="{level==1}" on:click="{setLevel}">
    {/if}
</div>

<style>
	#photo{
        min-width:100vw;
        min-height:100vh;
        position:absolute;
        z-index: 7777;
        top:0;
        left:0;
        background-color:gainsboro;
        display:flex;
        justify-content: center;
        overflow:auto;
    }

    #photo img{
        height:100vh;
        width:auto;
        cursor: zoom-in;
    }
    #photo img.level1{
        width:150vw;
        height:auto;
        cursor: zoom-out;
    }
</style>