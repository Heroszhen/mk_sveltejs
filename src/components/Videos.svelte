<script>
	import PageStore from '../stores/PageStore.js';
    import { useNavigate } from "svelte-navigator";
    import { getBaseurl } from '../services/ToolService.js';
    import { onDestroy } from 'svelte';

    PageStore.set("videos");
    const navigate = useNavigate();
    let allvideos = [];
    let baseurl = getBaseurl();
    let id = -1;
    let charge = true;
    let loading = false;
    getVideos();

    window.addEventListener('scroll', detecteWindowScroll,false);

    onDestroy(()=>window.removeEventListener('scroll', detecteWindowScroll,false));

    function detecteWindowScroll(e){
        if(window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight){
            loading = true;
            getVideos();
        }
    }

    function getVideos(){
        if(charge == true){
            charge = false;
            fetch(baseurl + "/mk/videos_web/" + id)
            .then(response=>response.json())
            .then(json=>{
                if(json["status"] == 200){
                    allvideos = allvideos.concat(json['allvideos']);
                    id = allvideos[allvideos.length - 1]["id"];
                    if(json['allvideos'].length > 0)charge = true;
                    loading = false;
                }
            });
        }
    }

    function getSiteIcon(videourl){
        if(videourl.includes("douyin.com"))return "assets/douyin.png";
        if(videourl.includes("kuaishou.com"))return "assets/kuaishou.png";
        return "";
    }
</script>

<div id="videos">
    <div class="container pt-2 pb-2">
        {#each allvideos as video,index(index)}
            <div class="onevideo" on:click="{() => navigate('/video/' + video['id'])}">
                <div class="wrap-image">
                    <img src="{video.photourl}" alt="">
                </div>
                <div class="name">
                    {#if getSiteIcon(video.videourl) != ""}
                        <img src={getSiteIcon(video.videourl)} alt="" class="site-icon">
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
    .container{
       display:flex;
       flex-wrap: wrap;
       justify-content:space-between;
    }
    .container .onevideo{
        --my-width:17vw;
        --my--height:calc(var(--my-width) / 2);
        width:var(--my-width);
        margin-bottom:30px;
        cursor: pointer;
    }
    .container .wrap-image{
        width:100%;
        height:var(--my--height);
        overflow: hidden; 
        text-align: center;
        background-color: #eeeeee5e;
    }

    .container .wrap-image img{
        height:100%;
        width:auto;
    }
    .container .wrap-image:hover{
        overflow: visible;
    }
    .container .wrap-image:hover img{
       transform: scale(1.5);
       transition:.5s;
    }
    img.site-icon{
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }

    #loaders{
        text-align: center;
        background:white;
        padding:10px;
    }
    @media(max-width:991px){
        .container .onevideo{
            --my-width:22vw;
        }
    }

    @media(max-width:767px){
        .container .onevideo{
            --my-width:34vw;
        }
        
    }
    @media(max-width:575px){
        .container .onevideo{
            --my-width:45vw;
        }
        .container .wrap-image:hover{
        overflow: hidden;
    }
    }
</style>