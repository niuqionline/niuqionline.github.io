// 音乐播放器功能实现
class MusicPlayer {
  constructor() {
    // 获取DOM元素
    this.audio = document.getElementById('audio-player');
    this.playBtn = document.getElementById('play-btn');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.progressBar = document.getElementById('progress-bar');
    this.progress = document.getElementById('progress');
    this.currentSong = document.getElementById('current-song');
    this.currentTimeEl = document.getElementById('current-time');
    this.durationEl = document.getElementById('duration');
    this.songList = document.getElementById('song-list');
    this.refreshBtn = document.getElementById('refresh-btn');
    
    // 初始化变量
    this.songs = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    
    // 绑定事件
    this.bindEvents();
    
    // 加载歌曲列表
    this.loadSongs();
  }
  
  // 绑定事件
  bindEvents() {
    // 播放/暂停按钮点击事件
    this.playBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });
    
    // 上一首按钮点击事件
    this.prevBtn.addEventListener('click', () => {
      this.playPrevious();
    });
    
    // 下一首按钮点击事件
    this.nextBtn.addEventListener('click', () => {
      this.playNext();
    });
    
    // 音频结束事件
    this.audio.addEventListener('ended', () => {
      this.playNext();
    });
    
    // 音频时间更新事件
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });
    
    // 音频元数据加载完成事件
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateDuration();
    });
    
    // 进度条点击事件
    this.progressBar.addEventListener('click', (e) => {
      const width = this.progressBar.clientWidth;
      const clickX = e.offsetX;
      const duration = this.audio.duration;
      this.audio.currentTime = (clickX / width) * duration;
    });
    
    // 刷新歌曲列表按钮点击事件
    if (this.refreshBtn) {
      this.refreshBtn.addEventListener('click', () => {
        this.refreshSongList();
      });
    }
  }
  
  // 加载歌曲列表
  loadSongs() {
    // 从配置中加载歌曲列表
    this.loadSongsFromConfig();
  }
  
  // 获取歌曲列表
  fetchSongList() {
    // 由于是静态网站，我们使用一个简单的方法来获取歌曲列表
    // 注意：在实际生产环境中，可能需要后端API支持
    
    // 支持的音乐文件格式
    const songExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma', '.opus'];
    
    // 尝试从服务器获取歌曲列表
    // 这里我们使用一个技巧：尝试请求songs目录下的文件
    // 由于是静态网站，我们需要一个预定义的方法来获取歌曲列表
    
    // 注意：在实际使用中，你需要根据你的部署环境修改此方法
    // 例如，如果你的网站部署在GitHub Pages上，你可能需要使用GitHub API
    // 如果你的网站部署在本地，你可能需要使用服务器端脚本
    
    // 由于我们已经看到hexo generate命令生成了songs目录下的文件
    // 我们可以使用一个简单的方法来模拟获取歌曲列表
    
    // 这里我们使用一个基于文件名的方法来获取歌曲列表
    // 实际使用中，你可能需要根据你的具体情况修改
    
    // 模拟获取歌曲列表
    // 注意：这是一个简化的实现，实际使用中需要根据具体情况修改
    
    // 由于我们看到hexo generate命令生成了fun/music/songs/亡命之徒 - 纵贯线.mp3
    // 我们可以假设songs目录下的文件会被正确生成
    
    // 这里我们使用一个动态的方法来获取歌曲列表
    // 实际使用中，你可能需要根据你的具体情况修改
    
    // 模拟获取歌曲列表
    const songFiles = this.getSongFiles();
    
    // 处理歌曲列表
    songFiles.forEach(file => {
      const fileName = file.replace(/\.[^/.]+$/, "");
      this.songs.push({
        name: fileName,
        path: `/fun/music/songs/${file}`
      });
    });
    
    // 生成歌曲列表
    this.generateSongList();
  }
  
  // 获取歌曲文件列表
  getSongFiles() {
    // 从window.musicConfig中读取歌曲列表
    if (window.musicConfig && window.musicConfig.songs) {
      return window.musicConfig.songs.map(song => {
        // 从path中提取文件名
        const pathParts = song.path.split('/');
        return pathParts[pathParts.length - 1];
      });
    }
    
    // 如果没有配置，返回空数组
    return [];
  }
  
  // 从配置中加载歌曲列表
  loadSongsFromConfig() {
    // 从window.musicConfig中读取歌曲列表
    if (window.musicConfig && window.musicConfig.songs) {
      this.songs = window.musicConfig.songs.map(song => {
        return {
          name: song.name,
          artist: song.artist,
          path: song.path
        };
      });
    } else {
      // 如果没有配置，使用默认列表
      this.songs = [];
    }
    
    // 生成歌曲列表
    this.generateSongList();
  }
  
  // 刷新歌曲列表
  refreshSongList() {
    this.loadSongs();
  }
  
  // 生成歌曲列表
  generateSongList() {
    this.songList.innerHTML = '';
    
    this.songs.forEach((song, index) => {
      const li = document.createElement('li');
      // 显示歌曲名和艺术家
      li.textContent = `${song.name} - ${song.artist || '未知艺术家'}`;
      li.addEventListener('click', () => {
        this.currentIndex = index;
        this.playSong();
      });
      this.songList.appendChild(li);
    });
  }
  
  // 播放歌曲
  playSong() {
    if (this.songs.length === 0) return;
    
    const song = this.songs[this.currentIndex];
    this.audio.src = song.path;
    this.currentSong.textContent = `${song.name} - ${song.artist || '未知艺术家'}`;
    this.audio.play();
    this.isPlaying = true;
    this.playBtn.textContent = '暂停';
    
    // 更新歌曲列表选中状态
    this.updateSongListActive();
  }
  
  // 播放
  play() {
    if (this.songs.length === 0) return;
    
    if (this.audio.src === '') {
      // 首次播放，加载第一首歌曲
      this.currentIndex = 0;
      this.playSong();
    } else {
      this.audio.play();
      this.isPlaying = true;
      this.playBtn.textContent = '暂停';
    }
  }
  
  // 暂停
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.playBtn.textContent = '播放';
  }
  
  // 播放上一首
  playPrevious() {
    if (this.songs.length === 0) return;
    
    this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
    this.playSong();
  }
  
  // 播放下一首
  playNext() {
    if (this.songs.length === 0) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.songs.length;
    this.playSong();
  }
  
  // 更新进度条
  updateProgress() {
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration;
    const progressPercent = (currentTime / duration) * 100;
    
    this.progress.style.width = `${progressPercent}%`;
    this.currentTimeEl.textContent = this.formatTime(currentTime);
  }
  
  // 更新歌曲时长
  updateDuration() {
    const duration = this.audio.duration;
    this.durationEl.textContent = this.formatTime(duration);
  }
  
  // 格式化时间
  formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  // 更新歌曲列表选中状态
  updateSongListActive() {
    const lis = this.songList.querySelectorAll('li');
    lis.forEach((li, index) => {
      if (index === this.currentIndex) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    });
  }
}

// 页面加载完成后初始化播放器
document.addEventListener('DOMContentLoaded', () => {
  new MusicPlayer();
});