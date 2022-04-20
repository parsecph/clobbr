import { css } from '@emotion/css';

export default function ActivityIndicator({
  animationIterations,
  keepGridAtTheEnd
}: {
  animationIterations?: number | string;
  keepGridAtTheEnd?: boolean;
}) {
  const strokeColor = 'rgba(170, 170, 170, 0.3)';
  const size = '120px';
  const totalAnim = 6;
  const delay = 1;
  const svgSize = 60;
  const squareLen = 240;
  const lineLen = svgSize;
  const lineOffset = -0.04;
  const linesPerSide = 3;
  const bigCircleLen = 140;
  const animationIterationCount = animationIterations || 1; // i.e. 'infinite'

  const AnimationStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      overflow: visible;
    }

    .pin {
      width: ${size};
      height: ${size};
      overflow: visible;

      &__group {
        transform-origin: 30px 30px;
        animation: group-anim ${totalAnim}s ${delay}s;
        animation-iteration-count: ${animationIterationCount};
        animation-fill-mode: forwards;
      }

      &__grayGroup {
        animation: gray-anim ${totalAnim}s ${delay}s;
        animation-iteration-count: ${animationIterationCount};
        animation-fill-mode: forwards;
      }

      &__square {
        stroke: ${strokeColor};
        stroke-dasharray: ${squareLen}, ${squareLen};
        stroke-dashoffset: ${squareLen};
        animation: square-anim ${totalAnim}s ${delay}s;
        animation-iteration-count: ${animationIterationCount};
        animation-fill-mode: forwards;
      }

      &__line {
        stroke: ${strokeColor};
        stroke-dasharray: ${lineLen}, ${lineLen};
        stroke-dashoffset: ${lineLen};

        ${Array.from({ length: linesPerSide }, (_, i) => i).map(
          (i) => `
            &-${i + 1} {
              animation: line-anim ${totalAnim}s ${
            totalAnim * lineOffset * (linesPerSide - i + 1) + delay
          }s;
              animation-iteration-count: ${animationIterationCount};
              animation-fill-mode: forwards;
            }
          `
        )}
      }

      &__circleBig {
        stroke-dasharray: ${bigCircleLen}, ${bigCircleLen};
        stroke-dashoffset: ${bigCircleLen};
        animation: bigCircle-anim ${totalAnim}s ${delay}s;
        animation-iteration-count: ${animationIterationCount};
        animation-fill-mode: forwards;
      }
    }

    @keyframes square-anim {
      15% {
        stroke-dashoffset: 0;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }

    @keyframes line-anim {
      23% {
        stroke-dashoffset: ${lineLen};
      }
      30% {
        stroke-dashoffset: 0;
      }
      ${!keepGridAtTheEnd
        ? `
            79% {
              stroke-dashoffset: 0;
              opacity: 0.2;
            }
            94% {
              opacity: 0;
            }
            100% {
              opacity: 0;
            }
          `
        : `
          100% {
            stroke-dashoffset: 0;
          }
        `}
    }

    @keyframes bigCircle-anim {
      30% {
        stroke-dashoffset: ${bigCircleLen};
      }
      43% {
        stroke-dashoffset: 0;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }

    @keyframes group-anim {
      94% {
        opacity: 1;
      }
      ${animationIterations === 'infinite'
        ? `
        100% {
          opacity: 0;
        }`
        : `
        100% {
          opacity: 1;
        }`}
    }

    @keyframes gray-anim {
      53% {
        opacity: 1;
      }
      ${animationIterations === 'infinite'
        ? `
        79% {
          opacity: 0.2;
        }
        94% {
          opacity: 0;
        }
        100% {
          opacity: 0;
        }`
        : `
        100% {
          opacity: 1;
        }`}
    }
  `;

  return (
    <div className={AnimationStyle}>
      <svg className="pin" viewBox="0 0 60 60" version="1.1">
        <g className="pin__group">
          <g className="pin__grayGroup">
            <svg x="0">
              <path
                className="pin__line pin__line-1"
                fill="none"
                strokeWidth="1"
                d="M15,0 15,60"
              />
              <path
                className="pin__line pin__line-2"
                fill="none"
                strokeWidth="1"
                d="M30,0 30,60"
              />
              <path
                className="pin__line pin__line-3"
                fill="none"
                strokeWidth="1"
                d="M45,0 45,60"
              />
              <path
                className="pin__line pin__line-1"
                fill="none"
                strokeWidth="1"
                d="M0,45 60,45"
              />
              <path
                className="pin__line pin__line-2"
                fill="none"
                strokeWidth="1"
                d="M0,30 60,30"
              />
              <path
                className="pin__line pin__line-3"
                fill="none"
                strokeWidth="1"
                d="M0,15 60,15"
              />
            </svg>

            <svg x="12" y="7.5">
              <path
                d="M33.954 38.185c-2.823 2.908-6.36 4.824-10.16 5.521-3.798.697-7.702.148-11.222-1.585-3.522-1.733-6.51-4.577-8.573-8.186C1.935 30.325.89 26.12 1.009 21.85c.117-4.269 1.39-8.397 3.647-11.862 2.257-3.464 5.393-6.104 9.001-7.601a17.911 17.911 0 0111.288-.843c3.755.946 7.183 3.093 9.844 6.184"
                className="pin__circleBig"
                fill="none"
                stroke="#88FFB8"
                strokeWidth="3.5"
              />
            </svg>
          </g>
        </g>
      </svg>
    </div>
  );
}
