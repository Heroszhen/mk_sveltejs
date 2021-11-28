<script>
    import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { onMount,onDestroy, afterUpdate } from 'svelte';

    PageStore.set("video");
	export let id;
    let video = null;
    const unsubscribe = DataStore.subscribe(value => {
		for(let entry of value["videos"]){
            if(entry["id"] == id){
                video = entry;

                break;
            }
        }
	});
    onDestroy(unsubscribe);

    function resetVideo(){
        let video = document.getElementsByTagName("iframe")[0];
        if(video != undefined){
            let width = (video.offsetWidth <= 900)?video.offsetWidth:853;
            let height = width / (16 / 9);
            video.style.height = height + "px";
        }
    }

    afterUpdate(() => {
        resetVideo();
    });
    window.addEventListener('resize', ()=>{resetVideo();});

</script>

<div id="video">
    <div class="container">
        {#if video != null}
            {#if video.videotype == 1}
            <div>
                {@html video.videourl}
            </div>
            {/if}
        {/if}
    </div>
</div>

<style>
	.container{
        padding:0;
    }
</style>