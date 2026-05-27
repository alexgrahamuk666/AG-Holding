/* a-graham.uk · File upload handler */

/* ════════════════════════════════════════════════════════
   File upload — drag & drop + click to browse
   Wire to your backend endpoint as needed.
   TODO: POST /api/upload { file } → { url, filename, size }
════════════════════════════════════════════════════════ */

(function(){
  var area  = document.getElementById('uploadArea');
  var input = document.getElementById('fileInput');
  var list  = document.getElementById('uploadList');
  var files = [];

  function formatSize(bytes){
    if(bytes < 1024) return bytes + ' B';
    if(bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/1048576).toFixed(1) + ' MB';
  }

  function renderFile(file, index){
    var item = document.createElement('div');
    item.className = 'upload-file-item';
    item.id = 'file-' + index;
    item.innerHTML =
      '<span class="upload-file-name">' + file.name + '</span>' +
      '<span class="upload-file-size">' + formatSize(file.size) + '</span>' +
      '<button class="upload-file-remove" onclick="removeFile(' + index + ')" aria-label="Remove ' + file.name + '">×</button>';

    var prog = document.createElement('div');
    prog.className = 'upload-progress';
    var fill = document.createElement('div');
    fill.className = 'upload-progress-fill';
    fill.id = 'prog-' + index;
    prog.appendChild(fill);

    var wrapper = document.createElement('div');
    wrapper.id = 'wrap-' + index;
    wrapper.appendChild(item);
    wrapper.appendChild(prog);
    list.appendChild(wrapper);

    /* Simulate progress — replace with real XHR/fetch */
    var pct = 0;
    var iv = setInterval(function(){
      pct += Math.random() * 25;
      if(pct >= 100){ pct = 100; clearInterval(iv); }
      var el = document.getElementById('prog-' + index);
      if(el) el.style.width = pct + '%';
    }, 180);
  }

  function addFiles(newFiles){
    Array.from(newFiles).forEach(function(f){
      if(f.size > 52428800){ alert(f.name + ' is over 50MB — skipped.'); return; }
      var idx = files.length;
      files.push(f);
      renderFile(f, idx);
    });
  }

  window.removeFile = function(idx){
    var el = document.getElementById('wrap-' + idx);
    if(el) el.remove();
  };

  /* Click to browse */
  input.addEventListener('change', function(){ addFiles(this.files); this.value=''; });

  /* Drag and drop */
  area.addEventListener('dragover', function(e){
    e.preventDefault(); this.classList.add('drag-over');
  });
  area.addEventListener('dragleave', function(){
    this.classList.remove('drag-over');
  });
  area.addEventListener('drop', function(e){
    e.preventDefault(); this.classList.remove('drag-over');
    addFiles(e.dataTransfer.files);
  });

  /* Keyboard accessibility */
  area.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); input.click(); }
  });
})();