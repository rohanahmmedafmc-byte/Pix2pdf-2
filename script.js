const { jsPDF } = window.jspdf;

const dropZone = document.getElementById("dropZone");
const input = document.getElementById("imageInput");
const convertBtn = document.getElementById("convertBtn");
const progressWrap = document.querySelector(".progress-wrap");
const progressBar = document.getElementById("progressBar");
const dropText = document.getElementById("dropText");
const fileInfo = document.getElementById("fileInfo");
const previewGrid = document.getElementById("previewGrid");

dropZone.addEventListener("click", () => input.click());

dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.classList.add("active");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("active");
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("active");
  input.files = e.dataTransfer.files;
  updateUI();
});

input.addEventListener("change", updateUI);

function updateUI() {
  const files = input.files;
  if (!files.length) return;

  dropZone.classList.add("uploaded");
  dropText.textContent = "Images ready";
  fileInfo.textContent = `${files.length} image${files.length > 1 ? "s" : ""} added`;
  convertBtn.disabled = false;

  previewGrid.innerHTML = "";

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      previewGrid.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

convertBtn.addEventListener("click", () => {
  if (!input.files.length) return;

  const pdf = new jsPDF();
  let index = 0;
  progressWrap.style.display = "block";

  const processImage = () => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const width = pdf.internal.pageSize.getWidth();
        const height = (img.height * width) / img.width;
        if (index > 0) pdf.addPage();
        pdf.addImage(img, "JPEG", 0, 0, width, height);

        index++;
        progressBar.style.width = `${(index / input.files.length) * 100}%`;

        if (index < input.files.length) {
          processImage();
        } else {
          pdf.save("Pix2PDF.pdf");
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(input.files[index]);
  };

  processImage();
});