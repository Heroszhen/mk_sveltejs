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
        let video_dom = document.getElementsByTagName("iframe")[0];
        if(video_dom != undefined){
            if(video.videotype == 4)return;
            let width = (video_dom.offsetWidth <= 900)?video_dom.offsetWidth:853;
            let height = width / (16 / 9);
            video_dom.style.height = height + "px";
        }
    }

    afterUpdate(() => {
        resetVideo();
    });
    window.addEventListener('resize', ()=>{resetVideo();});

</script>

<div id="video">
    <div class="container pb-2">
        
        {#if video != null}
            <div class="text-center">
                {#if video.videotype == 1 || video.videotype == 4}
                    {@html video.videourl}
                {/if}
                {#if video.videotype == 2}
                    {#if video.videourl.includes('amazon') || video.videourl.includes('aweme')}
                        <video width="300" height="200" id="video1" controls>
                            <source src="{video.videourl}" type="video/mp4">
                            <source src="movie.ogg" type="video/ogg">
                            <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
                            <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
                        </video>
                    {:else}
                        <a href="{video.siteurl}" target="_blank">
                            <img src="{video.photourl}" alt="" id="image1">
                        </a>
                    {/if}
                {/if}
                {#if video.videotype == 3}
                    <a href="{video.siteurl}" target="_blank">
                        <img src="{video.photourl}" alt="">
                    </a>
                {/if}
            </div>
            <div class="mt-4 pe-2 ps-2">
                <h4 class="fw-bold">{video.name}</h4>
                <div class="fw-bold">{video.actressname}</div>
                {#if video.description != null}
                    <div class="description">{@html video.description}</div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
	.container{
        padding:0;
    }
    .description{
        width:100%;
        clear: both;
        word-wrap: break-word;
    }
</style>