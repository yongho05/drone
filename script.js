let map;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심
    zoom: 12,
  });
}

document.getElementById("searchBtn").addEventListener("click", async () => {
  const topColor = document.getElementById("topColor").value;
  const bottomColor = document.getElementById("bottomColor").value;

  const formData = new FormData();
  formData.append("topColor", topColor);
  formData.append("bottomColor", bottomColor);

  const res = await fetch("http://localhost:5000/search", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  updateResults(data);
});

function updateResults(data) {
  const resultList = document.getElementById("resultList");
  resultList.innerHTML = "";
  clearMarkers();

  data.results.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.innerHTML = `<img src="${item.image_url}" width="100"><p>${item.name}</p>`;
    div.addEventListener("click", () => {
      document.getElementById("missingImage").src = item.image_url;
      document.getElementById("missingInfo").innerText = `${item.name}, ${item.description}`;
      map.setCenter({ lat: item.lat, lng: item.lng });
      map.setZoom(15);
    });
    resultList.appendChild(div);

    const marker = new google.maps.Marker({
      position: { lat: item.lat, lng: item.lng },
      map: map,
      title: item.name,
    });
    markers.push(marker);
  });
}

function clearMarkers() {
  for (const marker of markers) {
    marker.setMap(null);
  }
  markers = [];
}
document.getElementById("searchBtn").addEventListener("click", async () => {
  const topColor = document.getElementById("topColor").value;
  const bottomColor = document.getElementById("bottomColor").value;

  const formData = new FormData();
  formData.append("topColor", topColor);
  formData.append("bottomColor", bottomColor);

  const res = await fetch("http://localhost:5000/search", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  // 서버에서 받은 data.results 하나하나가 이미 YOLO + 색상 필터링된 실종자들
  updateResults(data);
});

// 여기는 수정 필요 없고 그대로 사용 가능
function updateResults(data) {
  const resultList = document.getElementById("resultList");
  resultList.innerHTML = "";
  clearMarkers();

  data.results.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "result-item";

    // 상의, 하의 색상 표시 (서버에서 온 값이라고 가정)
    let colorInfo = "";
    if(item.topColor) colorInfo += `상의: ${item.topColor} `;
    if(item.bottomColor) colorInfo += `하의: ${item.bottomColor}`;

    div.innerHTML = `
      <img src="${item.image_url}" width="100" />
      <p>${item.name}</p>
      <p>${colorInfo}</p>
    `;

    div.addEventListener("click", () => {
      document.getElementById("missingImage").src = item.image_url;
      document.getElementById("missingInfo").innerText = `${item.name}, ${item.description}`;
      map.setCenter({ lat: item.lat, lng: item.lng });
      map.setZoom(15);
    });
    resultList.appendChild(div);

    const marker = new google.maps.Marker({
      position: { lat: item.lat, lng: item.lng },
      map: map,
      title: item.name,
    });
    markers.push(marker);
  });
}

function clearMarkers() {
  for (const marker of markers) {
    marker.setMap(null);
  }
  markers = [];
}