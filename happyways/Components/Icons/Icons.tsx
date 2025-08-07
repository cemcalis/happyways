import React from 'react';
import { SvgProps } from 'react-native-svg';

// HomePage Icons
import HomeSvg from '../../assets/HomePage/home.svg';
import CarSvg from '../../assets/HomePage/car.svg';
import SearchSvg from '../../assets/HomePage/search.svg';
import CampaignSvg from '../../assets/HomePage/campaign.svg';
import UserSvg from '../../assets/HomePage/user.svg';
import LocationSvg from '../../assets/HomePage/location.svg';
import NotificationSvg from '../../assets/HomePage/notification.svg';
import FilterSvg from '../../assets/HomePage/filter.svg';
import SortSvg from '../../assets/HomePage/sort.svg';
import GridSvg from '../../assets/HomePage/grid.svg';
import ListSvg from '../../assets/HomePage/list.svg';
import FuelSvg from '../../assets/HomePage/fuel.svg';
import GearSvg from '../../assets/HomePage/gear.svg';
import SeatSvg from '../../assets/HomePage/seat.svg';
import SnowSvg from '../../assets/HomePage/snow.svg';
import FrontCarSvg from '../../assets/HomePage/frontcar.svg';
import LeftArrowSvg from '../../assets/HomePage/leftarrow.svg';
import BlackSearchSvg from '../../assets/HomePage/blacksearch.svg';

// Reservation Icons
import DoublelocationSvg from '../../assets/Reservation/doublelocation.svg';
import ClockSvg from '../../assets/Reservation/clock.svg';
import DateSvg from '../../assets/Reservation/date.svg';

// Account Icons
import EarthSvg from '../../assets/Account/earth.svg';
import MoneySvg from '../../assets/Account/money.svg';
import ThemaSvg from '../../assets/Account/thema.svg';
import LinkedinSvg from '../../assets/Account/linkedin.svg';
import IgSvg from '../../assets/Account/ig.svg';
import XSvg from '../../assets/Account/x.svg';
import FacebookSvg from '../../assets/Account/facebook.svg';
import YoutubeSvg from '../../assets/Account/youtube.svg';
import ArrowSvg from '../../assets/Account/arrow.svg';


import BackButtonSvg from '../../assets/BackButtons/backButtons.svg';


import ForwardButtonSvg from '../../assets/ForwardButton/ForwardButton.svg';

// ReservationCard Icons
import PathSvg from '../../assets/ReservationCard/path.svg';

export type IconName = 
 
  | 'home'
  | 'car'
  | 'search'
  | 'campaign'
  | 'user'
  | 'location'
  | 'notification'
  | 'filter'
  | 'sort'
  | 'grid'
  | 'list'
  | 'fuel'
  | 'gear'
  | 'seat'
  | 'snow'
  | 'frontcar'
  | 'leftarrow'
  | 'blacksearch'

  | 'doublelocation'
  | 'clock'
  | 'date'

  | 'earth'
  | 'money'
  | 'thema'
  | 'linkedin'
  | 'instagram'
  | 'x'
  | 'facebook'
  | 'youtube'
  | 'arrow'

  | 'back'
  | 'forward'
  | 'path';

interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
}

const iconMap = {

  home: HomeSvg,
  car: CarSvg,
  search: SearchSvg,
  campaign: CampaignSvg,
  user: UserSvg,
  location: LocationSvg,
  notification: NotificationSvg,
  filter: FilterSvg,
  sort: SortSvg,
  grid: GridSvg,
  list: ListSvg,
  fuel: FuelSvg,
  gear: GearSvg,
  seat: SeatSvg,
  snow: SnowSvg,
  frontcar: FrontCarSvg,
  leftarrow: LeftArrowSvg,
  blacksearch: BlackSearchSvg,

  doublelocation: DoublelocationSvg,
  clock: ClockSvg,
  date: DateSvg,

  earth: EarthSvg,
  money: MoneySvg,
  thema: ThemaSvg,
  linkedin: LinkedinSvg,
  instagram: IgSvg,
  x: XSvg,
  facebook: FacebookSvg,
  youtube: YoutubeSvg,
  arrow: ArrowSvg,
  // Button Icons
  back: BackButtonSvg,
  forward: ForwardButtonSvg,
  // ReservationCard Icons
  path: PathSvg,
};

const Icon: React.FC<IconProps> = ({ name, size = 24, width, height, ...props }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      width={width || size}
      height={height || size}
      {...props}
    />
  );
};

export default Icon;
