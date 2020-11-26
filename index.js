/**
 * OSS/S3 图片处理
 * @param {*} url 图片url
 * @param {*} options 处理参数
 * @return {string} 处理后的图片url
 *
 * options 具体属性：
 * @param {string} options.resize 缩放(可传值  sm: 高100  mid:高500  lg:高1000)
 * @param {number} options.rotate 旋转(可传值  8: 旋转270  3:旋转180  6:旋转90)
 * @param {number} options.blur 模糊(可传值  1: 轻度  2:重度)
 * @param {number} options.circle 内切圆
 * @param {boolean} options.lowContrast 低对比度
 *
 */
module.exports = (url, options = null) => {
  if (!url) {
    console.error("url is required!");
    return;
  }
  if (Array.isArray(url)) {
    url = url[0].url;
  }
  if (typeof url === "object" && url.url) {
    url = url.url;
  }

  if (!options) return url;

  if (url.includes("amazonaws.com")) {
    if (options.resize) {
      let params = [
        url.slice(0, url.lastIndexOf("/")),
        url.slice(url.lastIndexOf("/") + 1),
      ];
      if (options.resize === "sm") {
        return `${params[0]}/w_100/${params[1]}`;
      } else if (options.resize === "mid" || options.resize === "md") {
        return `${params[0]}/w_500/${params[1]}`;
      } else if (options.resize === "lg") {
        return `${params[0]}/w_1000/${params[1]}`;
      } else {
        return url;
      }
    } else {
      return url;
    }
  } else {
    const result = [];

    if (options.resize) {
      switch (options.resize) {
        case "sm":
          result.push("resize,h_100");
          break;

        case "mid":
          result.push("resize,h_500");
          break;
        case "md":
          result.push("resize,h_500");
          break;
        case "lg":
          result.push("resize,h_1000");
          break;

        default:
          result.push(`resize,h_${options.resize}`);
          break;
      }
    }

    if (options.rotate) {
      switch (parseInt(options.rotate)) {
        case 8:
          result.push("rotate,270");
          break;

        case 3:
          result.push("rotate,180");
          break;

        case 6:
          result.push("rotate,90");
          break;

        default:
          break;
      }
    }

    if (options.blur) {
      switch (parseInt(options.blur)) {
        case 1: // 轻度模糊
          result.push("blur,r_3,s_3");
          break;

        case 2: // 重度模糊
          result.push("blur,r_8,s_8");
          break;

        default:
          break;
      }
    }

    if (options.circle) {
      result.push(`circle,r_${options.circle}`);
    }

    if (options.lowContrast) {
      result.push(`contrast,-80`);
    }

    return `${url}?x-oss-process=image/${result.join("/")}`;
  }
};
