import { useEffect, useRef } from "react";
import { Map, Popup, MapMouseEvent } from "maplibre-gl";
import maplibregl from "maplibre-gl";
import type { Feature } from "geojson";


interface InfoPopupProps {
  map: Map | null;
  layers?: string[];
}

const pretty = (val?: string | number | null) =>
  val === undefined || val === null || val === "" ? "—" : val.toString();

const InfoPopup: React.FC<InfoPopupProps> = ({ map, layers = [] }) => {
  const popupRef = useRef<Popup | null>(null);

  useEffect(() => {
    if (!map) return;

    const hidePopup = () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };

    const handleClick = (e: MapMouseEvent) => {
      console.log("click detected");
      hidePopup();

      const queried = map.queryRenderedFeatures(e.point, {
        layers: layers.length ? layers : undefined,
      });
      if (!queried.length) return;

      const f = queried[0] as Feature;
      const p = f.properties ?? {};

      const html = `
        <div style="font-family: sans-serif; min-width: 150px">
          <h3 style="margin:0 0 4px 0;font-size:14px">${pretty(
            p.name || p.name_long || p.housename
          )}</h3>
          <table style="width:100%;font-size:12px">
            ${
              p.highway
                ? `<tr><td style="color:#888">Road&nbsp;type</td><td>${pretty(
                    p.highway
                  )}</td></tr>`
                : ""
            }
            ${
              p.building
                ? `<tr><td style="color:#888">Building</td><td>${pretty(
                    p.building
                  )}</td></tr>`
                : ""
            }
            ${
              p.leisure
                ? `<tr><td style="color:#888">Leisure</td><td>${pretty(
                    p.leisure
                  )}</td></tr>`
                : ""
            }
            <tr><td style="color:#888">OSM&nbsp;ID</td><td>${pretty(
              p.id
            )}</td></tr>
          </table>
        </div>
      `;

      popupRef.current = new Popup({
        closeButton: true,
        offset: 10,
        maxWidth: "250px",
      })
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map);
    };

    map.on("click", handleClick);
    map.on("movestart", hidePopup);

    return () => {
      hidePopup();
      map.off("click", handleClick);
      map.off("movestart", hidePopup);
    };
  }, [map, layers]);

  return null;
};

export default InfoPopup;
