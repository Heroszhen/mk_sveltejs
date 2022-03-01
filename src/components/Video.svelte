<script>
    import PageStore from '../stores/PageStore.js';
    //import DataStore from '../stores/DataStore.js';
    import { afterUpdate } from 'svelte';
    import { useNavigate } from "svelte-navigator";
    import { BoxArrowInRight } from "svelte-bootstrap-icons";
    import { getBaseurl } from '../services/ToolService.js';

    PageStore.set("video");
	export let id;
    const navigate = useNavigate();
    let baseurl = getBaseurl();
    let video = null;
    let nextvideos = [];
    let ref_nextvideos;
    /*
    const unsubscribe = DataStore.subscribe(value => {
        if(value["videos"].length != 0){
            allvideos = value["videos"];
            setVideos();
        }
	});
    onDestroy(unsubscribe);*/
    getOneVideo(id);
    function getOneVideo(id){
        fetch(baseurl + "/mk/onevideo_web/" + id)
        .then(response=>response.json())
        .then(json=>{
            if(json["status"] == 200){
                video = json["video"];console.log
                nextvideos = json["nextvideos"];
            }
        });
    }

    function setVideos(newid=null){
        video == null;
        nextvideos = [];
        if(newid == null)newid = id;
        else{
            id = newid;
            navigate('/video/' + id)
        }
        
        window.scroll(0,0);
        getOneVideo(id);
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
        if(ref_nextvideos != null)ref_nextvideos.scrollLeft = 0;
    });
    window.addEventListener('resize', ()=>{resetVideo();});

</script>

<div id="video" class="pb-3">
    {#if video != null}
        <div class="container pb-2">
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
    {/if}
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