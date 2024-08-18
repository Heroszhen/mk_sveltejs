<script>
    import PageStore from "../stores/PageStore.js";
    import { useNavigate } from "svelte-navigator";
    import { getBaseurl } from "../services/ToolService.js";
    import { onDestroy } from "svelte";
    import DataStore from "../stores/DataStore.js";
    import Video from "./Video.svelte";

    PageStore.set("videos");
    export let videoId;console.log(videoId)
    const navigate = useNavigate();
    let allvideos = [];
    let baseurl = getBaseurl();
    let id = -1;
    let charge = true;
    let loading = false;

    const unsubscribe = DataStore.subscribe((value) => {
        if (value["videos"].length == 0) getVideos();
        else {
            allvideos = value["videos"];
            id = allvideos[allvideos.length - 1]["id"];
        }
    });
    window.addEventListener("scroll", detecteWindowScroll, false);

    onDestroy(() => {
        unsubscribe;
        window.removeEventListener("scroll", detecteWindowScroll, false);
    });

    function detecteWindowScroll(e) {
        if (
            videoId === undefined &&
            window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight
        ) {
            loading = true;
            getVideos();
        }
    }

    function getVideos() {
        if (charge == true) {
            charge = false;
            fetch(baseurl + "/mk/videos_web/" + id)
                .then((response) => response.json())
                .then((json) => {
                    if (json["status"] == 200) {
                        allvideos = allvideos.concat(json["allvideos"]);
                        id = allvideos[allvideos.length - 1]["id"];
                        if (json["allvideos"].length > 0) charge = true;
                        loading = false;
                        DataStore.update((data) => {
                            data["videos"] = allvideos;
                            return data;
                        });
                    }
                });
        }
    }

    function getSiteIcon(videourl) {
        if (videourl.includes("douyin.com")) return "assets/douyin.png";
        if (videourl.includes("kuaishou.com")) return "assets/kuaishou.png";
        return "";
    }
</script>

{#if videoId !== undefined}
    <section id="video-modal">
        <Video id={videoId} />
    </section>
{/if}

<div id="videos">
    <div class="container pt-2 pb-2">
        {#each allvideos as video, index (index)}
            <div
                class="onevideo"
                on:click={() => navigate("/videos/" + video["id"])}
            >
                <div class="wrap-image">
                    <img src={video.photourl} alt="" />
                </div>
                <div class="name">
                    {#if getSiteIcon(video.videourl) != ""}
                        <img
                            src={getSiteIcon(video.videourl)}
                            alt=""
                            class="site-icon"
                        />
                    {/if}
                    {video.name}
                </div>
            </div>
        {/each}
    </div>
    {#if loading == true}
        <div id="loaders">
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    {/if}
</div>

<style>
    #video-modal {
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        max-height: 100vh;
        overflow-y: auto;
        background-color: white;
        padding-top: 66px;
    }

    #videos {
        min-height: calc(100vh + 10px);
    }
    .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .container .onevideo {
        --my-width: 22vw;
        --my--height: calc(var(--my-width) / 1.78);
        width: var(--my-width);
        margin-bottom: 30px;
        cursor: pointer;
    }
    .container .wrap-image {
        width: 100%;
        height: var(--my--height);
        overflow: hidden;
        text-align: center;
        background-color: #eeeeee5e;
    }

    .container .wrap-image img {
        height: 100%;
        width: auto;
        max-width: 100%;
    }
    .container .wrap-image:hover {
        overflow: visible;
    }
    .container .wrap-image:hover img {
        transform: scale(1.5);
        transition: 0.5s;
    }
    img.site-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }

    #loaders {
        text-align: center;
        background: white;
        padding: 10px;
    }
    @media (max-width: 991px) {
        .container .onevideo {
            --my-width: 22vw;
        }
    }

    @media (max-width: 767px) {
        .container .onevideo {
            --my-width: 34vw;
        }
    }
    @media (max-width: 575px) {
        .container .onevideo {
            --my-width: 94vw;
        }
        .container .wrap-image:hover {
            overflow: hidden;
        }
    }
</style>
