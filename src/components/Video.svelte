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
        ArrowsFullscreen,
        FullscreenExit,
        Share,
        ChevronLeft,
    } from "svelte-bootstrap-icons";
    import { getBaseurl, copyToClipboard } from "../services/ToolService.js";

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
    let fullscreen = false;
    let elem = document.documentElement;
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
                    window.scrollTo(0, 0);
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
        video = null;
        nextvideos = [];
        getOneVideo(id);
        //ref_nextvideos.scrollLeft = 0;
    }

    function resetVideo() {
        /*
        let video_dom = document.getElementsByTagName("iframe")[0];
        if (video_dom != undefined) {
            if (video.videotype == 4) return;
            let width =
                video_dom.offsetWidth <= 900 ? video_dom.offsetWidth : 853;
            let height = width / (16 / 9);
            video_dom.style.height = height + "px";
        }*/
        // let video1_dom = document.getElementById("video1");
        // if (video1_dom != null) {
        //     if (window.innerWidth < 768) {
        //         video1_dom.style.width = "100%";
        //     }
        // }
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

    function openFullscreen() {
        fullscreen = true;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE11 */
            elem.msRequestFullscreen();
        }
    }

    /* Close fullscreen */
    function closeFullscreen() {
        fullscreen = false;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE11 */
            document.msExitFullscreen();
        }
    }

    function getLink() {
        copyToClipboard("http://mk.yangzhen.fr/video/" + video["id"]);
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
            <div class="p-2">
                <div class="d-flex align-items-center">
                    <div class="me-3">
                        <a href={video.siteurl} id="siteurl" target="_blank">
                            <BoxArrowInRight width="30" height="30" />
                        </a>
                    </div>
                    <div class="me-3 pointer" on:click={getLink}>
                        <Share width="27" height="27" />
                    </div>
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
                <h4 class="fw-bold mt-2 ">{video.name}</h4>
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
            {#if fullscreen == false}
                <div class="func">
                    <ArrowsFullscreen
                        width="20"
                        height="20"
                        on:click={() => openFullscreen()}
                    />
                </div>
            {:else}
                <div class="func">
                    <FullscreenExit
                        width="20"
                        height="20"
                        on:click={() => closeFullscreen()}
                    />
                </div>
            {/if}
            <div class="func">
                <XCircle width="30" height="30" on:click={() => closeModal()} />
            </div>
        </div>
        {@html video.videourl}
    </div>
{/if}

<button class="btn-return meinuzi-btn" on:click={() => navigate(-1)}>
    <ChevronLeft />
</button>

<style>
    .container {
        padding: 0;
    }
    .tiktok {
        min-height: 600px;
    }
    img {
        max-width: 100%;
    }
    #video1 {
        max-width: 100%;
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
        margin-right: 20px;
    }
    @media (max-width: 767px) {
        #video1 {
            width: 100%;
        }
    }
    @media (max-width: 576px) {
        .list-nextvideos {
            padding: 2px 5px;
        }
        .list-nextvideos .onenextvideo {
            height: 200px;
        }
    }

    button.btn-return {
        position: fixed;
        z-index: 100;
        bottom: 40px;
        right: 20px;
        padding: 0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
    }
</style>
