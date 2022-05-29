<script>
    import PageStore from "../stores/PageStore.js";
    //import DataStore from '../stores/DataStore.js';
    import { afterUpdate } from "svelte";
    import { useNavigate } from "svelte-navigator";
    import {
        BoxArrowInRight,
        ArrowRepeat,
        XCircle,
        ArrowClockwise,
        ArrowCounterclockwise,
    } from "svelte-bootstrap-icons";
    import { getBaseurl } from "../services/ToolService.js";

    PageStore.set("video");
    export let id;
    const navigate = useNavigate();
    let baseurl = getBaseurl();
    let video = null;
    let nextvideos = [];
    let ref_nextvideos;
    let modal = false;
    let turn = 0;
    let angle = 0;
    /*
    const unsubscribe = DataStore.subscribe(value => {
        if(value["videos"].length != 0){
            allvideos = value["videos"];
            setVideos();
        }
	});
    onDestroy(unsubscribe);*/
    getOneVideo(id);
    function getOneVideo(id) {
        fetch(baseurl + "/mk/onevideo_web/" + id)
            .then((response) => response.json())
            .then((json) => {
                if (json["status"] == 200) {
                    video = json["video"];
                    nextvideos = json["nextvideos"];
                }
            });
    }

    function setVideos(newid = null) {
        video == null;
        nextvideos = [];
        if (newid == null) newid = id;
        else {
            id = newid;
            navigate("/video/" + id);
        }

        window.scroll(0, 0);
        getOneVideo(id);
        //ref_nextvideos.scrollLeft = 0;
    }

    function resetVideo() {
        let video_dom = document.getElementsByTagName("iframe")[0];
        if (video_dom != undefined) {
            if (video.videotype == 4) return;
            let width =
                video_dom.offsetWidth <= 900 ? video_dom.offsetWidth : 853;
            let height = width / (16 / 9);
            video_dom.style.height = height + "px";
        }
    }

    function openModal() {
        modal = true;
        turn = 0;
        angle = 0;
        window.setTimeout(() => {
            resetModalVideo();
        }, 500);
    }
    function closeModal() {
        modal = false;
        resetVideo();
    }

    function rotateModalVideo(sens) {
        let video_dom = document.querySelector(".modal-video iframe");
        turn = turn == 0 ? 1 : 0;
        let n = sens == 1 ? 1 : -1;
        angle += n * 90;
        video_dom.style.transform = "rotate(" + angle + "deg)";
        resetModalVideo();
    }

    function resetModalVideo() {
        if (modal == true) {
            let video_dom = document.querySelector(".modal-video iframe");
            if (video_dom != undefined) {
                if (video.videotype == 4) return;
                if (turn == 0) {
                    let width =
                        window.innerWidth >= 1300 ? 1300 : window.innerWidth;
                    let height = width / (16 / 9);
                    video_dom.style.width = width + "px";
                    video_dom.style.height = height + "px";
                } else {
                    let height = window.innerHeight;
                    let width = height / (16 / 9);
                    video_dom.style.width = height + "px"; //video_height
                    video_dom.style.height = width + "px"; //video_width
                    if (height < 500) {
                        width = window.innerWidth;
                        height = width * (16 / 9);
                    }
                    video_dom.style.width = height + "px";
                    video_dom.style.height = width + "px";
                }
            }
        }
    }

    afterUpdate(() => {
        resetVideo();
        if (ref_nextvideos != null) ref_nextvideos.scrollLeft = 0;
    });
    window.addEventListener("resize", () => {
        resetVideo();
        resetModalVideo();
    });
</script>

<div id="video" class="pb-3">
    {#if video != null}
        <div class="container pb-2">
            <div class="text-center" class:tiktok={video.videotype == 4}>
                {#if video.videotype == 1 || video.videotype == 4}
                    {@html video.videourl}
                {/if}
                {#if video.videotype == 2}
                    {#if video.videourl.includes("amazon") || video.videourl.includes("aweme")}
                        <video width="300" height="200" id="video1" controls>
                            <source src={video.videourl} type="video/mp4" />
                            <source src="movie.ogg" type="video/ogg" />
                            <track
                                src="captions_en.vtt"
                                kind="captions"
                                srclang="en"
                                label="english_captions"
                            />
                            <track
                                src="captions_es.vtt"
                                kind="captions"
                                srclang="es"
                                label="spanish_captions"
                            />
                        </video>
                    {:else}
                        <a href={video.siteurl} target="_blank">
                            <img src={video.photourl} alt="" id="image1" />
                        </a>
                    {/if}
                {/if}
                {#if video.videotype == 3}
                    <a href={video.siteurl} target="_blank">
                        <img src={video.photourl} alt="" />
                    </a>
                {/if}
            </div>
            <div class="pe-2 ps-2">
                <div class="d-flex">
                    <div>
                        {#if video.videotype == 1}
                            <ArrowRepeat
                                width="40"
                                height="40"
                                class="pe-2 pointer"
                                on:click={() => openModal()}
                            />
                        {/if}
                    </div>
                </div>
                <h4 class="fw-bold mt-2 ">
                    <a
                        href={video.siteurl}
                        class="pe-2"
                        id="siteurl"
                        target="_blank"
                        ><BoxArrowInRight width="30" height="30" /></a
                    >
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
                {#each nextvideos as video, index (index)}
                    <div
                        class="onenextvideo"
                        on:click={() => setVideos(video["id"])}
                    >
                        <img src={video.photourl} alt="" />
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

{#if modal == true}
    <div class="modal-video">
        <div>
            <div class="func">
                <ArrowClockwise
                    width="30"
                    height="30"
                    on:click={() => rotateModalVideo(1)}
                />
            </div>
            <div class="func">
                <ArrowCounterclockwise
                    width="30"
                    height="30"
                    on:click={() => rotateModalVideo(2)}
                />
            </div>
            <div class="func">
                <XCircle width="30" height="30" on:click={() => closeModal()} />
            </div>
        </div>
        {@html video.videourl}
    </div>
{/if}

<style>
    .container {
        padding: 0;
    }
    .description {
        width: 100%;
        clear: both;
        word-wrap: break-word;
    }
    .list-nextvideos {
        overflow-x: auto;
        display: flex;
        padding: 2px 10px;
        margin: 0 auto;
    }
    .list-nextvideos .onenextvideo {
        height: 150px;
        cursor: pointer;
        margin-left: 10px;
    }
    .list-nextvideos .onenextvideo img {
        height: 100%;
        width: auto;
    }
    .modal-video {
        position: absolute;
        z-index: 8888;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background-color: rgb(0, 0, 0);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-video > div:first-child {
        position: absolute;
        z-index: 9999;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 5px;
        top: 0;
        left: 0;
    }
    .modal-video > div:first-child > .func {
        cursor: pointer;
        color: white;
    }
    .modal-video > div:first-child > .func:not(:last-child) {
        margin-right: 10px;
    }
    @media (max-width: 576px) {
        .list-nextvideos {
            padding: 2px 5px;
        }
        .list-nextvideos .onenextvideo {
            height: 200px;
        }
    }
</style>
