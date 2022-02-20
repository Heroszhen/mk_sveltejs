<script>
    import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { onDestroy, afterUpdate } from 'svelte';
    import { useNavigate } from "svelte-navigator";
    import { BoxArrowInRight } from "svelte-bootstrap-icons";

    PageStore.set("video");
	export let id;
    const navigate = useNavigate();
    let allvideos = [];
    let video = null;
    let nextvideos = [];
    let ref_nextvideos;
    const unsubscribe = DataStore.subscribe(value => {
        if(value["videos"].length != 0){
            allvideos = value["videos"];
            setVideos();
        }
	});
    onDestroy(unsubscribe);

    function setVideos(newid=null){
        if(newid == null)newid = id;
        else{
            id = newid;
            navigate('/video/' + id)
        }
        let n = 20;
        let index;
        for(index in allvideos){
            if(allvideos[index]["id"] == newid){
                video = allvideos[index];
                window.scroll(0, 0);
                break;
            }
        }
        nextvideos = [];
        index++;
        for(let i = 0;i < n;i++){
            if(allvideos[index] == null)index = 0;
            nextvideos.push(allvideos[index]);
            index++;
        }
        //ref_nextvideos.scrollLeft = 0;
    }

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

<div id="video" class="pb-3">
    <div class="container pb-2">
        {#if video != null}
            <div class="text-center" class:tiktok="{video.videotype == 4}">
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
            <div class="mt-2 pe-2 ps-2">
                <h4 class="fw-bold">
                    <a href="{video.siteurl}" class="pe-2" id="siteurl" target="_blank"><BoxArrowInRight width="30" height="30" /></a>
                    {video.name}
                </h4>
                <div class="fw-bold">{video.actressname}</div>
                {#if video.description != null}
                    <div class="description">{@html video.description}</div>
                {/if}
            </div>
        {/if}
    </div>
    <div class="container mt-2">
        <div class="list-nextvideos" bind:this={ref_nextvideos}>
            {#each nextvideos as video,index(index)}
                <div class="onenextvideo" on:click="{() =>setVideos(video["id"])}">
                    <img src="{video.photourl}" alt="">
                </div>
            {/each}
        </div>
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
    .list-nextvideos{
        overflow-x: auto;
        display:flex;
        padding:2px 10px;
        margin:0 auto;
    }
    .list-nextvideos .onenextvideo{
        height:150px;
        cursor: pointer;
        margin-left:10px;
    }
    .list-nextvideos .onenextvideo img{
       height:100%;
       width:auto;
    }
    @media(max-width:576px){
        .list-nextvideos{
            padding:2px 5px;
        }
        .list-nextvideos .onenextvideo{
            height:200px;
        }
    }
</style>