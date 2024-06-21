import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from '@zos/device'
import { createWidget, widget, deleteWidget, prop } from '@zos/ui'
import { px } from '@zos/utils'
import { setPageBrightTime, resetPageBrightTime } from '@zos/display'
import { getText } from '@zos/i18n'
import { setScrollLock } from '@zos/page'

Page({
  build() {
    let rulerGroup = '';
    let fill_rect = '';
    let switchUnitsButton = '';
    let inversionButton = '';
    let rotationButton = '';
    let wakelockCheckbox = '';
    let wakelockCheckboxGroup = '';
    let switchUnitsButtonX = getDeviceInfo().width / 2 + px(5);
    let switchUnitsButtonY = px(70);
    let inversionButtonX = getDeviceInfo().width / 2 - px(95);
    let inversionButtonY = px(70);
    let rotationButtonX = getDeviceInfo().width / 2 - px(95);
    let rotationButtonY = getDeviceInfo().height - px(125);
    let rotationButtonYrot = getDeviceInfo().height / 2 - px(95);
    let rotationButtonXrot = getDeviceInfo().width - px(125);
    let wakelockCheckboxGroupX = getDeviceInfo().width / 2 + px(5);
    let wakelockCheckboxGroupY = getDeviceInfo().height - px(125);
    let wakelockCheckboxGroupYrot = getDeviceInfo().height / 2 + px(5);
    let wakelockCheckboxGroupXrot = getDeviceInfo().width - px(125);
    let offsetY = getDeviceInfo().screenShape === SCREEN_SHAPE_SQUARE ? 0 : 30;
    let offsetYrot = getDeviceInfo().screenShape === SCREEN_SHAPE_SQUARE ? 30 : 0;
    let config = { unitSystem: 'metric', inversion: false, rotation: false };

    drawUI();
    setScrollLock({
      lock: true,
    });

    function drawUI() {
      let PPI = getPPI();
      let pixelSizeInInches = 1 / PPI;
      let pixelSizeInMM = pixelSizeInInches * 25.4;
      let rulerLength = (getDeviceInfo().width - px(10)) / PPI * 25.4;
      let unitLabel = config.unitSystem === 'metric' ? getText('cm') : getText('inch');
      let normal_icon = '';
      let press_icon = '';

      fill_rect = createWidget(widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: getDeviceInfo().width,
        h: getDeviceInfo().height,
        radius: 0,
        color: config.inversion ? 0xffffff : 0x000000
      })
      
      if (!config.rotation) {
        rulerGroup = createWidget(widget.GROUP, {
          x: px(10),
          y: getDeviceInfo().height / 2 - px(10),
          w: getDeviceInfo().width - px(10),
          h: px(60)
        });
      } else {
        rulerGroup = createWidget(widget.GROUP, {
          x: getDeviceInfo().width / 2 - px(10),
          y: 0,
          w: px(60),
          h: getDeviceInfo().height - px(10)
        });
      }

      if (!config.rotation) {
        for (let i = 0; i <= rulerLength; i++) {
          let isMajorMark, label, position, lineHeight;

          if (config.unitSystem === 'metric') {
            lineHeight = 15
            if (isMajorMark = i % 10 === 0) {
              lineHeight = 30;
            } else if (i % 5 === 0) {
              lineHeight = 22;
            }
            label = i / 10;
            position = i / pixelSizeInMM;
          } else {
            lineHeight = 10
            if (isMajorMark = i % 16 === 0) {
              lineHeight = 30;
            } else if (i % 4 === 0) {
              lineHeight = 20;
            } else if (i % 2 === 0) {
              lineHeight = 15;
            }
            label = i / 16;
            position = i / pixelSizeInInches / 16;
          }

          rulerGroup.createWidget(widget.FILL_RECT, {
            x: position,
            y: 0,
            w: px(2),
            h: lineHeight,
            color: config.inversion ? 0x000000 : 0xffffff
          });

          if (isMajorMark) {
            rulerGroup.createWidget(widget.TEXT, {
              x: position,
              y: px(35),
              text: `${label} ${unitLabel}`,
              color: config.inversion ? 0x000000 : 0xffffff,
              fontSize: px(16)
            });
          }
        }
      } else {
        for (let i = 0; i <= rulerLength; i++) {
          let isMajorMark, label, position, lineHeight;

          if (config.unitSystem === 'metric') {
            lineHeight = 15
            if (isMajorMark = i % 10 === 0) {
              lineHeight = 30;
            } else if (i % 5 === 0) {
              lineHeight = 22;
            }
            label = i / 10;
            position = i / pixelSizeInMM;
          } else {
            lineHeight = 10
            if (isMajorMark = i % 16 === 0) {
              lineHeight = 30;
            } else if (i % 4 === 0) {
              lineHeight = 20;
            } else if (i % 2 === 0) {
              lineHeight = 15;
            }
            label = i / 16;
            position = i / pixelSizeInInches / 16;
          }

          rulerGroup.createWidget(widget.FILL_RECT, {
            x: 0,
            y: getDeviceInfo().height - px(10) - position,
            w: lineHeight,
            h: px(2),
            color: config.inversion ? 0x000000 : 0xffffff
          });

          if (isMajorMark) {
            rulerGroup.createWidget(widget.TEXT, {
              x: px(35),
              y: getDeviceInfo().height - px(25) - position,
              text: `${label} ${unitLabel}`,
              color: config.inversion ? 0x000000 : 0xffffff,
              fontSize: px(16)
            });
          }
        }
      }

      normal_icon = config.inversion ? 'units_dark.png' : 'units.png';
      press_icon = config.inversion ? 'units_dark_pressed.png' : 'units_pressed.png';

      switchUnitsButton = createWidget(widget.BUTTON, {
        x: config.rotation ? switchUnitsButtonY - px(30) : switchUnitsButtonX,
        y: config.rotation ? switchUnitsButtonX + offsetYrot : switchUnitsButtonY - offsetY,
        w: px(92),
        h: px(92),
        normal_src: normal_icon,
        press_src: press_icon,
        text: '',
        click_func: () => {
          switchUnitSystem();
        }
      });

      normal_icon = config.inversion ? 'dark.png' : 'light.png';
      press_icon = config.inversion ? 'dark_pressed.png' : 'light_pressed.png';

      inversionButton = createWidget(widget.BUTTON, {
        x: config.rotation ? inversionButtonY - px(30) : inversionButtonX,
        y: config.rotation ? inversionButtonX + offsetYrot : inversionButtonY - offsetY,
        w: px(92),
        h: px(92),
        normal_src: normal_icon,
        press_src: press_icon,
        text: '',
        click_func: () => {
          invert();
        }
      });

      normal_icon = config.inversion ? 'rotate_dark.png' : 'rotate.png';
      press_icon = config.inversion ? 'rotate_dark_pressed.png' : 'rotate_pressed.png';

      rotationButton = createWidget(widget.BUTTON, {
        x: config.rotation ? rotationButtonXrot : rotationButtonX,
        y: config.rotation ? rotationButtonYrot : rotationButtonY,
        w: px(92),
        h: px(92),
        normal_src: normal_icon,
        press_src: press_icon,
        text: '',
        click_func: () => {
          rotate();
        }
      });

      normal_icon = config.inversion ? 'wakelock_dark.png' : 'wakelock.png';
      press_icon = config.inversion ? 'wakelock_dark_selected.png' : 'wakelock_selected.png';

      wakelockCheckboxGroup = createWidget(widget.CHECKBOX_GROUP, {
        x: config.rotation ? wakelockCheckboxGroupXrot : wakelockCheckboxGroupX,
        y: config.rotation ? wakelockCheckboxGroupYrot : wakelockCheckboxGroupY,
        w: px(92),
        h: px(92),
        select_src: press_icon,
        unselect_src: normal_icon,
        check_func: (group, index, checked) => {
          wakeLock(checked);
        }
      });

      wakelockCheckbox = wakelockCheckboxGroup.createWidget(widget.STATE_BUTTON, {
        x: 0,
        y: 0,
        w: px(92),
        h: px(92)
      });

      wakelockCheckboxGroup.setProperty(prop.INIT, wakelockCheckbox)
      wakelockCheckboxGroup.setProperty(prop.UNCHECKED, wakelockCheckbox)
    }

    function invert() {
      disableInput();
      clearUI();
      let newUnitSystem = config.inversion === false ? true : false;
      Object.assign(config, { inversion: newUnitSystem });
      drawUI();
      enableInput();
    }

    function rotate() {
      disableInput();
      clearUI();
      let newUnitSystem = config.rotation === false ? true : false;
      Object.assign(config, { rotation: newUnitSystem });
      drawUI();
      enableInput();
    }

    function switchUnitSystem() {
      disableInput();
      clearUI();
      let newUnitSystem = config.unitSystem === 'metric' ? 'imperial' : 'metric';
      Object.assign(config, { unitSystem: newUnitSystem });
      drawUI();
      enableInput();
    }

    function wakeLock(checked) {
      disableInput();
      if (checked) {
        setPageBrightTime({ brightTime: 300000, });
      } else {
        resetPageBrightTime();
      }
      enableInput();
    }

    function clearUI() {
      deleteWidget(fill_rect);
      deleteWidget(rulerGroup);
      deleteWidget(switchUnitsButton);
      deleteWidget(inversionButton);
      deleteWidget(rotationButton);
      deleteWidget(wakelockCheckboxGroup);
    }

    function disableInput() {
      switchUnitsButton.setEnable(false)
      inversionButton.setEnable(false)
      rotationButton.setEnable(false)
      wakelockCheckboxGroup.setEnable(false)
    }

    function enableInput() {
      switchUnitsButton.setEnable(true)
      inversionButton.setEnable(true)
      rotationButton.setEnable(true)
      wakelockCheckboxGroup.setEnable(true)
    }

    function getPPI() {
      let deviceID = getDeviceInfo().deviceSource;
      switch (deviceID) {
        case 251: // gtr-mini
          return 326;
        case 8519936: // balance
          return 323;
        case 8519937:
          return 323;
        case 8519939:
          return 323;
        case 8388864: // active-edge
          return 277;
        case 8388865:
          return 277;
        case 8323328: // active
          return 341;
        case 8323329:
          return 341;
        case 7930112: // gtr4
          return 326;
        case 7930113:
          return 326;
        case 7864577:
          return 326;
        case 7995648: // gts4
          return 341;
        case 7995649:
          return 341;
        case 6553856: // trex-ultra
          return 326;
        case 6553857:
          return 326;
        case 418: // trex2
          return 326;
        case 419:
          return 326;
        case 8126720: // cheetah-pro
          return 331;
        case 8126721:
          return 331;
        case 8192256: // cheetah-r
          return 326;
        case 8192257:
          return 326;
        case 8257793: // cheetah-s
          return 341;
        case 414: // falcon
          return 326;
        case 415:
          return 326;
        case 8454400: // bip5
          return 260;
        case 8454401:
          return 260;
        default:
          return 326;
      }
    }
  }
})
